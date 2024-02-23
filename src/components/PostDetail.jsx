import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PostDetail = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { slug } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/posts/${slug}/`);
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error("There was an error fetching the post:", error);
            }
        };

        fetchPost();
    }, [slug]);

    const goToPosts = () => {
        navigate('/posts'); 
    };

    if (!post) return <div>Loading...</div>;
    
    return (
        <div className='post-detail'>
            <div className="dashboard-link">
                <button onClick={goToPosts} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

export default PostDetail;
