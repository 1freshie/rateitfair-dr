import { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

export default function Error({ statusCode }: ErrorProps) {
  return (
    <div className="self-center w-full h-full flex justify-center items-center text-center">
      {statusCode === 404 ? (
        <div>
          <h1>404 | This page could not be found.</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      ) : statusCode === 500 ? (
        <div>
          <h1>500 | Internal Server Error</h1>
          <p>Oops! Something went wrong on our end.</p>
        </div>
      ) : (
        <div>
          <h1>{statusCode} | An error occurred.</h1>
          <p>Sorry, an error occurred on the server.</p>
        </div>
      )}
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
