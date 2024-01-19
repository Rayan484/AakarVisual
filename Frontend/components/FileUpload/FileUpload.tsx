import Image from "next/image";
import styles from "./FileUpload.module.css";
import imageCompression from "browser-image-compression";
import React, { useEffect } from "react";
import { cropImage } from "../../utils/helpers/maskUtils";
const FileUpload = (props: any) => {
  // Design By
  // - https://dribbble.com/shots/13992184-File-Uploader-Drag-Drop

  // Select Upload-Area
  useEffect(() => {
    const uploadArea = document.querySelector("#uploadArea") as HTMLElement;

    // Select Drop-Zoon Area
    const dropZoon = document.querySelector("#dropZoon") as HTMLElement;

    // Loading Text
    const loadingText = document.querySelector("#loadingText") as HTMLElement;

    // Slect File Input
    const fileInput = document.querySelector("#fileInput") as HTMLElement;

    // Select Preview Image
    const previewImage = document.querySelector("#previewImage") as HTMLElement;

    // File-Details Area
    const fileDetails = document.querySelector("#fileDetails") as HTMLElement;

    // Uploaded File
    const uploadedFile = document.querySelector("#uploadedFile") as HTMLElement;

    // Uploaded File Info
    const uploadedFileInfo = document.querySelector(
      "#uploadedFileInfo"
    ) as HTMLElement;

    // Uploaded File  Name
    const uploadedFileName = document.querySelector(
      "#uploadedFileName"
    ) as HTMLElement;

    // Uploaded File Icon
    const uploadedFileIconText = document.querySelector(
      "#uploadedFileIconText"
    ) as HTMLElement;
    // Uploaded File Counter
    const uploadedFileCounter = document.querySelector(
      "#uploadedFileCounter"
    ) as HTMLElement;

    // ToolTip Data
    const toolTipData = document.querySelector(
      "#uploadAreaTooltipData"
    ) as HTMLElement;

    // Images Types
    const imagesTypes = ["jpeg", "png", "svg", "gif"];

    // Append Images Types Array Inisde Tooltip Data
    toolTipData!.innerHTML = [...imagesTypes].join(", .");

    // When (drop-zoon) has (dragover) Event
    dropZoon?.addEventListener("dragover", function (event) {
      // Prevent Default Behavior
      event.preventDefault();

      // Add Class (drop-zoon--over) On (drop-zoon)
      dropZoon?.classList.add("drop_zoon--over");
    });

    // When (drop-zoon) has (dragleave) Event
    dropZoon?.addEventListener("dragleave", function (event) {
      // Remove Class (drop-zoon--over) from (drop-zoon)
      dropZoon?.classList.remove("drop_zoon--over");
    });

    // When (drop-zoon) has (drop) Event
    dropZoon?.addEventListener("drop", function (event: any) {
      // Prevent Default Behavior
      event.preventDefault();

      // Remove Class (drop-zoon--over) from (drop-zoon)
      dropZoon?.classList.remove("drop_zoon--over");

      // Select The Dropped File
      const file = event.dataTransfer.files[0];

      // Call Function uploadFile(), And Send To Her The Dropped File :)
      uploadFile(file);
    });

    // When (drop-zoon) has (click) Event
    dropZoon?.addEventListener("click", function (event: any) {
      // Click The (fileInput)

      fileInput?.click();
    });

    // When (fileInput) has (change) Event
    fileInput?.addEventListener("change", function (event: any) {
      // Select The Chosen File
      const file = event.target.files[0];

      // Call Function uploadFile(), And Send To Her The Chosen File :)
      if (file) uploadFile(file);
    });

    // Upload File Function
    function uploadFile(file: any) {
      // FileReader()
      const fileReader = new FileReader();
      // File Type
      const fileType = file.type;
      // File Size
      const fileSize = file.size;

      // If File Is Passed from the (File Validation) Function
      if (fileValidate(fileType, fileSize)) {
        // Add Class (drop-zoon--Uploaded) on (drop-zoon)
        dropZoon?.classList.add("drop_zoon--Uploaded");

        loadingText.style.display = "block";
        // Hide Preview Image

        previewImage.style.display = "none";

        // Remove Class (uploaded-file--open) From (uploadedFile)
        uploadedFile?.classList.remove("uploaded_file--open");
        // Remove Class (uploaded-file__info--active) from (uploadedFileInfo)
        uploadedFileInfo?.classList.remove("uploaded_file__info--active");

        // After File Reader Loaded
        fileReader.addEventListener("load", function () {
          // After Half Second
          setTimeout(function () {
            // Add Class (upload-area--open) On (uploadArea)
            uploadArea.classList.add("upload_area--open");

            // Hide Loading-text (please-wait) Element
            loadingText.style.display = "none";
            // Show Preview Image
            previewImage.style.display = "block";
            // Add Class (file-details--open) On (fileDetails)
            fileDetails.classList.add("file_details--open");
            // Add Class (uploaded-file--open) On (uploadedFile)
            uploadedFile.classList.add("uploaded_file--open");
            // Add Class (uploaded-file__info--active) On (uploadedFileInfo)
            uploadedFileInfo.classList.add("uploaded_file__info--active");
          }, 500); // 0.5s

          // Add The (fileReader) Result Inside (previewImage) Source
          if (fileReader!.result !== null) {
            previewImage.setAttribute("src", fileReader!.result as string);
          }

          // Add File Name Inside Uploaded File Name
          uploadedFileName!.innerHTML = file.name;

          // Call Function progressMove();
          progressMove();
        });

        // Read (file) As Data Url
        fileReader.readAsDataURL(file);
      }
    }

    // Progress Counter Increase Function
    function progressMove() {
      // Counter Start
      let counter = 0;

      // After 600ms
      setTimeout(() => {
        // Every 100ms
        let counterIncrease = setInterval(() => {
          // If (counter) is equle 100
          if (counter === 100) {
            // Stop (Counter Increase)
            clearInterval(counterIncrease);
          } else {
            // Else
            // plus 10 on counter
            counter = counter + 10;
            // add (counter) vlaue inisde (uploadedFileCounter)
            uploadedFileCounter!.innerHTML = `${counter}%`;
          }
        }, 100);
      }, 600);
    }

    // Simple File Validate Function
    function fileValidate(fileType: any, fileSize: any) {
      // File Type Validation
      let isImage = imagesTypes.filter(
        (type) => fileType.indexOf(`image/${type}`) !== -1
      );

      // If The Uploaded File Type Is 'jpeg'
      if (isImage[0] === "jpeg") {
        // Add Inisde (uploadedFileIconText) The (jpg) Value
        uploadedFileIconText.innerHTML = "jpg";
      } else {
        // else
        // Add Inisde (uploadedFileIconText) The Uploaded File Type
        uploadedFileIconText.innerHTML = isImage[0];
      }

      // If The Uploaded File Is An Image
      if (isImage.length !== 0) {
        return true;
      } else {
        // Else File Type
        return alert("Please make sure to upload An Image File Type");
      }
    }
  });

  // :)
  return (
    <div id="uploadArea" className={`${styles.upload_area} mx-auto mb-0 pb-4`}>
      <div className={styles.upload_area__header}>
        <h1 className={styles.upload_area__title}>Upload your file</h1>
        <p className={styles.upload_area__paragraph}>
          File should be an image&nbsp;
          <strong className={styles.upload_area__tooltip}>
            Like
            <span
              id="uploadAreaTooltipData"
              className={styles.upload_area__tooltip_data}
            ></span>
          </strong>
        </p>
        <p className="fw-bold pb-0 mb-0">
          Will Crop Image to{" "}
          <span className="text-danger">3:2 aspect ratio</span> for better
          viewing experience.
        </p>
      </div>
      <div
        id="dropZoon"
        className={`${styles.upload_area__drop_zoon} ${styles.drop_zoon}`}
      >
        <span className={styles.drop_zoon__icon}>
          <i className="bx bxs-file-image"></i>
        </span>
        <p className={styles.drop_zoon__paragraph}>
          Drop your file here or Click to browse
        </p>
        <span id="loadingText" className={styles.drop_zoon__loading_text}>
          Please Wait
        </span>
        <Image
          src=""
          alt="Preview Image"
          id="previewImage"
          className={styles.drop_zoon__preview_image}
          draggable="false"
        />

        <input
          type="file"
          id="fileInput"
          className={styles.drop_zoon__file_input}
          accept="image/*"
          title="input"
          ref={props.fileInput}
        />
      </div>

      <div
        id="fileDetails"
        className={`${styles.upload_area__file_details} ${styles.file_details} mt-2`}
      >
        <h3 className={styles.file_details__title}>Uploaded File</h3>

        <div id="uploadedFile" className={styles.uploaded_file}>
          <div className={styles.uploaded_file__icon_container}>
            <i
              className={`bx bxs-file-blank ${styles.uploaded_file__icon}`}
            ></i>
            <span
              id="uploadedFileIconText"
              className={styles.uploaded_file__icon_text}
            ></span>
          </div>

          <div id="uploadedFileInfo" className={styles.uploaded_file__info}>
            <span id="uploadedFileName" className={styles.uploaded_file__name}>
              Proejct 1
            </span>
            <span
              id="uploadedFileCounter"
              className={styles.uploaded_file__counter}
            >
              0%
            </span>
          </div>
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const file = props.fileInput.current?.files[0];
          const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          try {
            const compressedFile = await imageCompression(file, options);
            // convert the blob to file
            const compfile = new File([compressedFile], file.name, {
              type: "image/jpeg",
              lastModified: compressedFile.lastModified,
            });
            cropImage(3 / 2, compfile).then((image) => {
              props.setFile(image);
              props.getEmbedding(image);
            });
          } catch (error) {
            console.log(error);
          }
        }}
        className=""
      >
        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};
export default FileUpload;
