import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="display-3 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary mt-3">Go to Homepage</Link>
    </div>
  );
}
