import styles from './ErrorBanner.module.css';

function ErrorBanner({message}){
    if (!message) return null;
    return (
        <div className={styles.error}>
            <p>{message}</p>
        </div>
    );
}
export default ErrorBanner;