import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout())
            .then(() => history.push('/'));
    };

    return (
        <>
            <button className='profile-btn' onClick={openMenu}>
                <i className="fa-solid fa-bars"></i>
                <i className="fas fa-user-circle" />
            </button>
            {showMenu && (
                <ul className="profile-dropdown">
                    <li>{`${user.firstName} ${user.lastName}`}</li>
                    <li>{user.email}</li>
                    <li className='profile-dropdown-links'>
                        {/* <Link to={`/users/${user.id}/bookings`}>Trips</Link>
                    </li>
                    <li> */}
                        <Link to={`/users/${user.id}/reviews`}>Manage Reviews</Link>
                    </li>
                    <li>
                        <Link to={`/users/${user.id}/spots`}>Manage Listings</Link>
                    </li>
                    <li className='profile-dropdown-logout'>
                        <button onClick={logout}>Log Out</button>
                    </li>
                </ul>
            )}
        </>
    );
}

export default ProfileButton;
