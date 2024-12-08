import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
  return (
    <section className={styles.containerHeader}>
      <Image src="/logo.svg" alt="logo-qr-space" width={220} height={140} />
      <h1 className={styles.title}>Generador automatizado<br/>de codigos QR</h1>
    </section>
  );
}
