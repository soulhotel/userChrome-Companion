import { useRef, useEffect, useState } from "react";
import ExtSection from "./component/ExtSection";
import AppBehaviorSection from "./component/AppBehaviorSection";
import PresetsSection from "./component/PresetsSection";
import DataSection from "./component/DataSection";
import AboutSection from "./component/AboutSection";



export default function Settings() {
  const refs = useRef({});
  const [openCreatePresetModal, setOpenCreatePresetModal] = useState(false);

  function scrollTo(id) {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (window.location.hash === "#toolbar/presets/create") {
      setOpenCreatePresetModal(true);
    }
  }, []);

  const SECTIONS = [
    { id: "extension", label: "Extension Status", Component: ExtSection, props: {} },
    { id: "config", label: "App Behavior", Component: AppBehaviorSection, props: {} },
    { id: "presets", label: "Manage Presets", Component: PresetsSection, props: { openCreatePresetModal, onCreatePresetModalHandled: () => setOpenCreatePresetModal(false) }, },
    { id: "data", label: "Manage Data", Component: DataSection, props: {} },
    { id: "about", label: "About UCC", Component: AboutSection, props: {} },
  ];

  return (
    <div className="page">
      <nav className="sidebar">
        <div className="sidebar-container">
          {SECTIONS.map((s) => (
            <div key={s.id} className="sidebar-list-item" onClick={() => scrollTo(s.id)}>
              {s.label}
            </div>
          ))}
        </div>
      </nav>
      <main className="content">
        <section className="content-header">userChrome Companion Settings</section>
        {SECTIONS.map(({ id, label, Component, props }) => (
          <section key={id} ref={(el) => (refs.current[id] = el)} className="content-section">
            <div className="section-header">{label}</div>
            <Component {...props} />
            <divider/>
          </section>
        ))}
      </main>
    </div>
  );
}