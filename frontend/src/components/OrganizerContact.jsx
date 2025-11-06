export default function OrganizerContact({ name, email, mobile }) {
    return (
        <div>
            <p>{name}</p>
            {email && <p className="text-sm text-gray-700">{email}</p>}
            {mobile && <p className="text-sm text-gray-700">{mobile}</p>}
        </div>
    );
}


