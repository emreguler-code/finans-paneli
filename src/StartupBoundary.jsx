import { Component } from "react";
export class StartupBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="setup-page">
          <h1>Finans</h1>
          <p role="alert">
            Ekran yüklenemedi. Sayfayı yenileyerek yeniden deneyin.
          </p>
          <button className="primary-button" onClick={() => location.reload()}>
            Sayfayı yenile
          </button>
        </main>
      );
    return this.props.children;
  }
}
