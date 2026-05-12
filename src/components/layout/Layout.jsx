/**
 * Layout.jsx
 * Main app shell: Sidebar on the left + right column (TopBar + page content).
 *
 * Structure:
 *   <div flex-row h-screen overflow-hidden>
 *     <Sidebar />                    ← fixed width, full height
 *     <div flex-col flex-1>
 *       <TopBar />                   ← fixed height h-16
 *       <main overflow-y-auto p-6>   ← scrollable page content
 *         <Outlet />                 ← React Router renders the active page here
 *       </main>
 *     </div>
 *   </div>
 *
 * The outer container is overflow-hidden to prevent double scrollbars.
 * Only the <main> element scrolls.
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      {/* ── Sidebar (fixed left column) ─────────────────────────────────── */}
      <Sidebar />

      {/* ── Right column: TopBar + scrollable page content ──────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        {/* Main content area — this is the only thing that scrolls */}
        <main className="flex-1 overflow-y-auto bg-app-bg p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
