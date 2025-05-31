import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Button, Form, Badge, Modal, Dropdown } from 'react-bootstrap';
import { db, auth } from '../config/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import '../styles/ForoEventos.css';

// IDs de administradores (puedes poner varios)
const ADMIN_IDS = ['ID_DEL_ADMIN'];

const ForoEventos = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  // Cargar usuario autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // Cargar eventos y posts
  useEffect(() => {
    const eventsUnsubscribe = onSnapshot(collection(db, 'eventos'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const postsQuery = selectedEvent
      ? query(collection(db, 'foroPosts'), where('eventId', '==', selectedEvent), orderBy('createdAt', 'desc'))
      : query(collection(db, 'foroPosts'), orderBy('createdAt', 'desc'));

    const postsUnsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsArray);
    });

    return () => {
      eventsUnsubscribe();
      postsUnsubscribe();
    };
  }, [selectedEvent]);

  // Mapeo rápido de eventos por id
  const eventsMap = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      map[ev.id] = ev;
    });
    return map;
  }, [events]);

  // Publicar o editar post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user || !selectedEvent) return;

    const postData = {
      content: newPost,
      author: user.displayName || user.email,
      authorId: user.uid,
      createdAt: serverTimestamp(),
      likes: [],
      dislikes: [],
      destacado: false,
      eventId: selectedEvent,
      comments: []
    };

    if (editingPost) {
      await updateDoc(doc(db, 'foroPosts', editingPost.id), {
        ...postData,
        createdAt: editingPost.createdAt // No sobreescribir fecha original
      });
      setEditingPost(null);
    } else {
      await addDoc(collection(db, 'foroPosts'), postData);
    }
    setNewPost('');
  };

  // Reaccionar a un post
  const handleReaction = async (postId, reaction) => {
    if (!user) return;
    const postRef = doc(db, 'foroPosts', postId);
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (post[reaction]?.includes(user.uid)) {
      await updateDoc(postRef, {
        [reaction]: arrayRemove(user.uid)
      });
    } else {
      const opposite = reaction === 'likes' ? 'dislikes' : 'likes';
      if (post[opposite]?.includes(user.uid)) {
        await updateDoc(postRef, {
          [opposite]: arrayRemove(user.uid)
        });
      }
      await updateDoc(postRef, {
        [reaction]: arrayUnion(user.uid)
      });
    }
  };

  // Destacar post (solo admin)
  const handleDestacado = async (postId) => {
    const postRef = doc(db, 'foroPosts', postId);
    await updateDoc(postRef, { destacado: true });
  };

  // Eliminar post
  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      await deleteDoc(doc(db, 'foroPosts', postId));
    }
  };

  // Editar post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost(post.content);
    setSelectedEvent(post.eventId);
  };

  // Agregar comentario
  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    const postRef = doc(db, 'foroPosts', selectedPost.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        content: newComment,
        author: user.displayName || user.email,
        createdAt: new Date().toISOString()
      })
    });
    setNewComment('');
    setShowCommentModal(false);
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date.toDate?.() || date;
    return d.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <Container className="foro-eventos-container">
      <h1 className="foro-title">Foro de Eventos</h1>
      <Form.Select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="event-select mb-3"
      >
        <option value="">Todos los eventos</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>
            {event.nombre || event.title || 'Evento sin nombre'}
          </option>
        ))}
      </Form.Select>
      {user ? (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group>
            
            <Form.Control
              as="textarea"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Comparte tu opinión sobre un evento..."
              required
              rows={3}
            />
          </Form.Group>
          <Button type="submit" className="mt-2">
            {editingPost ? 'Actualizar' : 'Publicar'}
          </Button>
          {editingPost && (
            <Button variant="secondary" className="mt-2 ms-2" onClick={() => setEditingPost(null)}>
              Cancelar
            </Button>
          )}
        </Form>
      ) : (
        <p className="text-muted">Inicia sesión para publicar comentarios.</p>
      )}

      {posts.length === 0 && (
        <p className="text-center text-muted">No hay publicaciones en este foro aún.</p>
      )}

      {posts.map(post => (
        <Card key={post.id} className={`mb-3 ${post.destacado ? 'border-warning' : ''}`}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <Badge bg="info" className="me-2">
                  {eventsMap[post.eventId]?.nombre || eventsMap[post.eventId]?.title || 'Evento'}
                </Badge>
                <span className="text-muted" style={{ fontSize: '0.95em' }}>
                  {formatDate(post.createdAt)}
                </span>
              </div>
              {post.destacado && <Badge bg="warning" text="dark">Destacado</Badge>}
            </div>
            <Card.Title className="mb-1">{post.author}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            <div className="mb-2">
              <Button
                variant={post.likes?.includes(user?.uid) ? "primary" : "outline-primary"}
                onClick={() => handleReaction(post.id, 'likes')}
                disabled={!user}
                size="sm"
              >
                👍 {post.likes?.length || 0}
              </Button>
              <Button
                variant={post.dislikes?.includes(user?.uid) ? "danger" : "outline-danger"}
                className="mx-2"
                onClick={() => handleReaction(post.id, 'dislikes')}
                disabled={!user}
                size="sm"
              >
                👎 {post.dislikes?.length || 0}
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  setSelectedPost(post);
                  setShowCommentModal(true);
                }}
              >
                💬 {post.comments?.length || 0}
              </Button>
              {ADMIN_IDS.includes(user?.uid) && !post.destacado && (
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDestacado(post.id)}
                >
                  Destacar
                </Button>
              )}
            </div>
            {user?.uid === post.authorId && (
              <Dropdown className="float-end">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                  ⚙️
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditPost(post)}>Editar</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeletePost(post.id)}>Eliminar</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* Modal de comentarios */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Comentarios sobre "{eventsMap[selectedPost?.eventId]?.nombre || eventsMap[selectedPost?.eventId]?.title || 'Evento'}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost?.comments?.length > 0 ? (
            selectedPost.comments.map((comment, index) => (
              <Card key={index} className="mb-2">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Card.Title className="mb-0" style={{ fontSize: '1rem' }}>{comment.author}</Card.Title>
                    <span className="text-muted" style={{ fontSize: '0.85em' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <Card.Text>{comment.content}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-muted">No hay comentarios aún.</p>
          )}
          {user ? (
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añade un comentario..."
                  rows={2}
                />
              </Form.Group>
            </Form>
          ) : (
            <p className="text-muted">Inicia sesión para comentar.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            Cerrar
          </Button>
          {user && (
            <Button variant="primary" onClick={handleAddComment} disabled={!newComment.trim()}>
              Comentar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ForoEventos;