import React, { useState } from "react";
import { addReviewImage } from "../../store/images";
import { useDispatch, useSelector } from "react-redux";
import './ImageForm.css';
import { loadUserReviews } from "../../store/reviews";

function ImageForm({ onClose, id }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(addReviewImage(id, { url }))
            .then(() => onClose())
            .then(() => dispatch(loadUserReviews(sessionUser.id)))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data) setErrors(data);
                }
            );
    };

    return (
        <div className='image-form'>
            <div className='imageform-title'>
                <button className='image-form-close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <p className="image-text">Add an image</p>
            </div>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.message}
                </ul>
                <div className="form-element">
                    <label >
                        Image url
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-element">
                    <button type="submit">Add</button>
                </div>
            </form >
        </div>
    );
}

export default ImageForm;