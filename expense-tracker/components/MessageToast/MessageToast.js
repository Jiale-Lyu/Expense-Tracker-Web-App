import styles from './MessageToast.module.scss';

// exports MessageToast Component 
export default function MessageToast(message) {
    const toggleDetailModal = (e) => {   
        e.target.closest('#toast-message-modal').setAttribute("style", "visibility: hidden")
    }

    // returns the message to be dispalyed inside the MessageToast component
    return (
        <div className={styles.modal} id='toast-message-modal'>
            <div className={styles.modalContent} id="toast-content">
                <span className={styles.closeButton} id="close-toast" onClick={(e) => toggleDetailModal(e)}>&times;</span>
                <h5 className={styles.container}> { message.displayMessage }</h5>
             </div>
        </div>
    );
}