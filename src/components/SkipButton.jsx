import '../styles/SkipButton.css';

export default function SkipButton({ onClick }) {
  return (
    <button type="button" className="skip-button" onClick={onClick}>
      Skip intro
    </button>
  );
}
