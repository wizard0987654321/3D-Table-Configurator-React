import profileSvg from '../assets/profileIcon.svg';
import { useNavigate } from 'react-router-dom';

export default function ProfileIcon() {
    const navigate = useNavigate();

    return (
        <div    style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            color: 'red'
        }}>
            <h2>Profile Icon Placeholder</h2>
            <img src={profileSvg} 
                 alt="Profile Icon" 
                 width="50" height="50" 
                 onClick={() => navigate("/saved-configurations")}/>
        </div>
    )
}