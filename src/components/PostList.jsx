import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PostList = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/posts/`); // Update with your API URL
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("There was an error fetching the posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const goToLP = () => {
        navigate('/'); 
    };

    return (
        <div className='blog-container'>
            <div className="dashboard-link">
                <button onClick={goToLP} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            {posts.map(post => (
                <div key={post.id} className='post-preview'>
                    <h2>{post.title}</h2>
                    <p>{post.content.substring(0, 200)}...</p>
                    <Link className='read-more-link' to={`/posts/${post.slug}`}>Leia mais</Link>
                </div>
            ))}
        </div>
    );
};

export default PostList;
