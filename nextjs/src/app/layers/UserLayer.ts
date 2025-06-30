import { IconLayer } from "deck.gl";

const UserLayer = ({ lng, lat }: { lng: number; lat: number }) => {
  return new IconLayer({
    id: "user-icon",
    data: [{ lng, lat }],
    getIcon: () => ({
      url: "/icons/user.svg", // public folder
      width: 128,
      height: 128,
      anchorY: 128,
    }),
    getPosition: (d) => {
      return [d.lng, d.lat];
    },
    onClick: (p) => {
      console.log(p, "here");
    },
    sizeScale: 1,
    getSize: () => 35,
    getColor: [255, 0, 0],
  });
};

export default UserLayer;
