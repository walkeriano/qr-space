import styles from "./intro.module.css";
import Image from "next/image";

export default function Intro(){
    return(
        <div className={styles.containerLoader}>
          <Image src="/logo.svg" alt="logo-qr-space" width={290} height={190} className={styles.imgLogo} />
          <div className={styles.loader}></div>
          <h2 className={styles.titleDev}>Desarrollado por @walkeriano</h2>
        </div>
    )
}

