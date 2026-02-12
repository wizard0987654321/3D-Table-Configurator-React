import profileSvg from '../assets/profileIcon.svg';
import { useNavigate } from 'react-router-dom';

export default function ProfileIcon() {
    const navigate = useNavigate();

    return (
        <div
            role="button"
            onClick={() => navigate('/saved-configurations')}
            style={{
                position: 'fixed', top: '20px', right: '20px', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#fff', border: '3px solid #272b35', cursor: 'pointer'
            }}
        >
            <img src={profileSvg} alt="" style={{ width: '24px' }} />
        </div>
    );
}