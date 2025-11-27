export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1>Offline mode</h1>
        <p>
          You’re currently offline. You can still open pages you visited before;
          new data will sync when you’re back online.
        </p>
      </div>
    </main>
  );
}
