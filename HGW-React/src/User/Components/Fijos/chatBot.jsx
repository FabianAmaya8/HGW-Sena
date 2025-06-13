export default function ChatBot() {
    return (
        <div className="dropup-center dropup chat-bot">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bx bxs-bot"></i>
            </button>
            <ul className="dropdown-menu">
                {['Español', 'Ingles', 'Chat Bot'].map((item) => (
                    <li key={item}>
                        <a className="dropdown-item" href="#">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
