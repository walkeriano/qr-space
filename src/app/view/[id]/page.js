"use client";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import { ref, getMetadata } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function View() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "qr-links", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const documentData = docSnap.data();
            setData(documentData);
            const fileRef = ref(storage, documentData.url);
            const metadata = await getMetadata(fileRef);
            setFileType(metadata.contentType);
          } else {
            console.error("No se encontró el documento");
            setData(null);
          }
        } catch (error) {
          console.error(
            "Error al obtener el documento o los metadatos:",
            error
          );
        } finally {
          setLoading(false);
        }
      } else {
        console.error("ID no disponible");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  if (!data) return <p>No se encontró la información del QR.</p>;

  return (
    <div className={styles.generalView}>
      {fileType && (
        <section className={styles.boxContent}>
          {fileType.startsWith("image/") ? (
            <div className={styles.imageVisual}>
              <img src={data?.url} alt="Imagen almacenada"/>
            </div>
          ) : fileType === "application/pdf" ? (
            <div className={styles.fileVisual}>
              <embed
                src={data?.url}
                type="application/pdf"
                className={styles.fileview}
              />
            </div>
          ) : (
            <p>El archivo no es compatible para previsualización.</p>
          )}
        </section>
      )}
    </div>
  );
}
