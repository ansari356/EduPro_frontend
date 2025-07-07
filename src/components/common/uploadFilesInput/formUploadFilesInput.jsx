
import React from "react";
import { useDropzone } from "react-dropzone";
import "./formUploadFilesInput.css";
import { Form } from "react-bootstrap";

function FormUploadFilesInput({ label = "Upload Files", id,className = "", helpText = "", isError = false ,placeholder}) {
	const _id = id || label?.toLowerCase().replace(/\s/g, "");
	const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone();

  const files = acceptedFiles.map((file) => (
	<li className="form-upload-file-item" key={file.path}>
	  <span>{file.path}</span>
	  <span className="text-muted" style={{ fontSize: "0.85em" }}>{(file.size / 1024).toFixed(1)} KB</span>
	</li>
  ));

  return (
		<div className={`my-3  ${className}`}>
			<Form.Label className="fw-bold" htmlFor={_id}>
				{label}
			</Form.Label>
			<div
				{...getRootProps({
					className: `form-upload-dropzone${
						isDragActive ? " form-upload-dropzone-active" : ""
					}`,
				})}
				tabIndex={0}
			>
				<Form.Control id={_id} type="file" {...getInputProps()} />
				<div style={{ margin: 0 }}>
					<h6>{placeholder}</h6>
					<p>
						<Form.Text
							className={`${isError ? "text-danger" : "text-muted"}`}
							id={`${_id}-help`}
						>
							{helpText
								? { helpText }
								: "Drag and drop an file here, or browse to select a file"}
						</Form.Text>
					</p>
				</div>
				<div>
					<ul className="form-upload-files-list">{files}</ul>
				</div>
			</div>
		</div>
	);
}

export default FormUploadFilesInput;
