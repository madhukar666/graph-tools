import React from "react"
import GraphVisualizer from "./components/GraphVisualizer"

import ResponsiveAppBar from "./components/NavBar"
export default function App() {

  return (
    <div>
      <ResponsiveAppBar />
      <div className="flex  flex-column items-align-items-center justify-content-center">
        <GraphVisualizer class />
      </div>
    </div>
  )
}