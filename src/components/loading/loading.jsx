import styles from "./loading.module.css";


export default function Loading(){
    return(
        <div className={styles.containerLoader}>
          <div className={styles.loader}></div>
          <p>Generando nuevo QR...</p>
        </div>
    )
}