import Map from "./components/Map";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="flex  h-screen justify-center items-center">
        <Map />
      </div>
    </div>
  );
}
