import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FileInputProps {
  url?: string;
  label: string;
  id: string;
  name: string;
  filePreviewURL: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInput({
  url,
  label,
  id,
  name,
  filePreviewURL,
  onChange,
}: FileInputProps) {
  return (
    <div className="w-full flex flex-col justify-center gap-y-1">
      <p className="ml-2 small-paragraph text-secondary--orange">{label}</p>
      <div className="flex items-center justify-center w-full small-paragraph">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-36 lg:h-44 border-2 border-secondary--gray border-dashed rounded-2xl cursor-pointer bg-background--white"
        >
          {filePreviewURL ? (
            <div className="flex flex-1 justify-center items-center w-32 h-32">
              <img
                src={filePreviewURL}
                alt="Preview"
                className="w-auto h-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-2">
              <div className="flex items-center justify-center">
                <span className="rounded-full inline-flex items-center justify-center h-8 lg:h-10 w-8 lg:w-10 bg-background--white text-secondary--gray">
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </span>
              </div>
              <p className="mb-2 font-medium">Click to upload</p>
              <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}
