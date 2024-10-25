import React, { useState, useEffect } from "react";


interface FeatureFlag {
  key: string;
  name: string;
  enabled: boolean;
}

export default function FeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [newFlagName, setNewFlagName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFeatureFlags();

    async function getFeatureFlags() {
      setLoading(true);
      const response = await fetch("/.netlify/functions/featureFlags", {
        method: "GET",
      });
      const data = await response.json();
      setFeatureFlags(data);
      setLoading(false);
    }
  }, []);

  async function updateFeatureFlags(flags: FeatureFlag[]) {
    await fetch("/.netlify/functions/featureFlags", {
      method: "PUT",
      body: JSON.stringify(flags),
    });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFlagName(event.target.value);
  };

  const handleAddFeatureFlag = async () => {
    if (newFlagName.trim() !== "") {
      const newFlags = [
        ...featureFlags,
        { key: new Date().toISOString(), name: newFlagName, enabled: false },
      ];
      setFeatureFlags(newFlags);
      updateFeatureFlags(newFlags);
      setNewFlagName("");
    }
  };

  const handleToggleFeatureFlag = async (key: string) => {
    const updatedFlags = featureFlags.map((flag) =>
      flag.key === key ? { ...flag, enabled: !flag.enabled } : flag
    );
    setFeatureFlags(updatedFlags);
    updateFeatureFlags(updatedFlags);
  };

  const handleDeleteFeatureFlag = async (key: string) => {
    const updatedFlags = featureFlags.filter((flag) => flag.key !== key);
    updateFeatureFlags(updatedFlags);
    setFeatureFlags(updatedFlags);
  };

  return (
    <div>
      <Nav title="Feature Flags" />
      <h1>Feature Flag Management</h1>
      <input
        type="text"
        value={newFlagName}
        onChange={handleInputChange}
        placeholder="Enter new feature flag name"
      />
      <button onClick={handleAddFeatureFlag}>Add Feature Flag</button>
      {!loading && (
        <ul>
          {featureFlags.map((flag) => (
            <li key={flag.key}>
              {flag.name}
              <button onClick={() => handleToggleFeatureFlag(flag.key)}>
                {flag.enabled ? "Disable" : "Enable"}
              </button>
              <button onClick={() => handleDeleteFeatureFlag(flag.key)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Fetch feature flags on the server side
export async function getServerSideProps() {
  const response = await fetch("http://localhost:3000/.netlify/functions/featureFlags");
  const data = await response.json();
  return { props: { initialFeatureFlags: data } };
}
