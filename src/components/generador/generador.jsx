"use client";
import styles from "./generador.module.css";
import React, { useState } from "react";
import { db, storage } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode";
import Image from "next/image";
import Loading from "../loading/loading";
import isURL from "validator/lib/isURL";


export default function Generador() {
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [uniqueLink, setUniqueLink] = useState("");
  const [status, setStatus] = useState("form");
  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileMessage, setFileMessage] = useState("El campo está vacío");
  const [linkMessage, setLinkMessage] = useState("El campo está vacío");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      let fileUrl = link;

      // Si el usuario sube un archivo, guárdalo en Firebase Storage
      if (file) {
        const fileRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      // Guarda la URL o el link en Firestore
      const docRef = await addDoc(collection(db, "qr-links"), {
        url: fileUrl,
        createdAt: new Date(),
      });

      // Si el link no es un archivo, lo guardamos directamente
      const generatedLink = file
        ? `${window.location.origin}/view/${docRef.id}`
        : fileUrl;
      setUniqueLink(generatedLink);

      const qr = await QRCode.toDataURL(generatedLink);
      setQrCode(qr);

      // Agregamos un retraso mínimo de 3 segundos
      setTimeout(() => {
        setStatus("result"); // Cambiar a estado 'result' después de 3 segundos
      }, 4000); // 3000ms = 3 segundos
    } catch (error) {
      console.error("Error al crear el QR:", error);
      setStatus("form"); // Volver al formulario en caso de error
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uniqueLink);
    alert("¡Link copiado al portapapeles!");
  };

  const downloadQrCode = () => {
    const a = document.createElement("a");
    a.href = qrCode;
    a.download = "qr-code.png"; // Nombre del archivo
    a.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      // Generar previsualización para imágenes o PDFs
      const fileType = selectedFile.type;

      if (fileType.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile)); // Imagen previsualizable
      } else if (fileType === "application/pdf") {
        setPreview("/pdf-icon.png"); // Icono genérico para PDFs (puedes personalizarlo)
      } else {
        setPreview(null); // No soportado
      }

      setFileMessage("Archivo listo para publicar ✅"); // Actualizar mensaje
    } else {
      setPreview(null); // Reiniciar previsualización
      setFileMessage("El campo está vacío"); // Actualizar mensaje
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value.trim();
    setLink(value);

    if (value === "") {
      setLinkMessage("El campo está vacío");
    } else if (!isURL(value, { require_protocol: true })) {
      setLinkMessage("Por favor, ingrese un enlace válido (debe incluir http:// o https://) ❌");
    } else {
      setLinkMessage("Link válido ✅");
    }
  };

  return (
    <div className={styles.generator}>
      {status === "form" && (
        <form className={styles.formGeneral} onSubmit={handleSubmit}>
          <section className={styles.functions}>
            <button
              type="button"
              onClick={() => setShow(false)}
              className={!show ? styles.activeButton : styles.inactiveButton}
            >
              <Image src="/icon-one.svg" alt="" width={50} height={50} />
              <p>
                Mostrar
                <br />
                archivo
              </p>
            </button>
            <button
              type="button"
              onClick={() => setShow(true)}
              className={show ? styles.activeButton : styles.inactiveButton}
            >
              <Image src="/icon-two.svg" alt="" width={50} height={50} />
              <p>
                Redirigir
                <br />a una URL
              </p>
            </button>
          </section>
          {show ? (
            <section className={styles.inputFile}>
              <div className={styles.inputTitle}>
                <h2>QR link destino</h2>
                <p>Formatos: Web o url</p>
              </div>
              <div className={styles.inputEnlace}>
                <label>Ingresar link aquí:</label>
                <input
                  type="text"
                  placeholder="Ej: https://restaurante.com"
                  value={link}
                  onChange={handleLinkChange}
                />
              </div>
              <div className={styles.fileMessage}>
                <p>{linkMessage}</p>
              </div>
            </section>
          ) : (
            <section className={styles.inputFile}>
              <div className={styles.inputTitle}>
                <h2>QR archivo personalizado</h2>
                <p>Formatos: Jpg, png, jpeg y pdf</p>
              </div>
              <label htmlFor="fileInput" className={styles.inputAdjuntar}>
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  onChange={handleFileChange}
                />
                {preview && (
                  <div className={styles.previewContainer}>
                    {file?.type === "application/pdf" ? (
                      <div className={styles.pdfContainer}>
                        <Image
                          src="/iconpdf.svg"
                          alt="PDF preview"
                          width={150}
                          height={150}
                        />
                      </div>
                    ) : (
                      <Image
                        src={preview}
                        alt="Previsualización de archivo"
                        width={100}
                        height={100}
                        className={styles.imageAdjunta}
                      />
                    )}
                  </div>
                )}
                <div className={styles.intoInput}>
                  <Image src="/more.svg" alt="" width={35} height={35} />
                  <p>Adjuntar aquí</p>
                </div>
              </label>
              <div className={styles.fileMessage}>
                <p>{fileMessage}</p>
              </div>
            </section>
          )}
          <button
            className={styles.buttonGenerate}
            type="submit"
            disabled={!link && !file}
          >
            <p>Generar nuevo QR</p>
          </button>
        </form>
      )}

      {status === "loading" && <Loading />}

      {status === "result" && (
        <div className={styles.resultados}>
          <div className={styles.firstSpace}>
            <h2>Tu nuevo QR está listo</h2>
            <Image src="/arrow.svg" alt="icon" width={25} height={25} />
          </div>
          <div className={styles.codigo}>
            <Image src={qrCode} fill={true} alt="QR Code" />
          </div>
          <div className={styles.linkGenerate}>
            <div className={styles.containertitle}>
              <p>Link destino</p>
              <span>
                <Image src="/enlace.svg" alt="icon" width={25} height={25} />
              </span>
            </div>
            <a href={uniqueLink} target="_blank" rel="noopener noreferrer">
              {uniqueLink}
            </a>
          </div>
          <div className={styles.info}>
            <button onClick={copyToClipboard}>
              Copiar link
              <span>
                <Image src="/copy.svg" alt="icon" width={25} height={25} />
              </span>
            </button>
            <button onClick={downloadQrCode}>
              Descargar QR
              <span>
                <Image src="/download.svg" alt="icon" width={30} height={30} />
              </span>
            </button>
          </div>
          <button
            className={styles.buttonBack}
            onClick={() => {
              setQrCode("");
              setUniqueLink("");
              setLink("");
              setFile(null);
              setPreview(null); // Reinicia la previsualización
              setStatus("form"); // Cambiar estado de la vista
              setFileMessage("El campo está vacío"); // Resetear mensaje del archivo
              setLinkMessage("El campo está vacío"); // Resetear mensaje del link
            }}
          >
            Volver al inicio
            <span>
              <Image src="/back.svg" alt="icon" width={25} height={25} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
