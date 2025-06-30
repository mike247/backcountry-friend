import type { Deck, Viewport, Widget } from "deck.gl";
import LocateMe from "./LocateMe";
import { createRoot, Root } from "react-dom/client";

type LocateWidgetProps = {
  size?: number;
};

class LocateWidget implements Widget<LocateWidgetProps> {
  id: string;
  root?: Root;
  props: LocateWidgetProps;
  viewId?: string | null = null;
  viewports: { [id: string]: Viewport } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deck?: Deck<any>;

  constructor(props: LocateWidgetProps) {
    this.id = "locate-widget";
    this.props = props;
    this.viewId = this.viewId;
  }

  //   onViewportChange(viewport: Viewport) {
  //     // no need to update if viewport is the same
  //     if (!viewport.equals(this.viewports[viewport.id])) {
  //       this.viewports[viewport.id] = viewport;
  //       this.update();
  //     }
  //   }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd({ deck }: { deck: Deck<any> }) {
    const container = document.createElement("div");
    container.style.pointerEvents = "auto"; // allow clicks
    this.root = createRoot(container);
    this.deck = deck;
    this.update();
    return container;
  }

  onViewportChange(viewport: Viewport) {
    // no need to update if viewport is the same
    if (!viewport.equals(this.viewports[viewport.id])) {
      this.viewports[viewport.id] = viewport;
      this.update();
    }
  }

  setProps() {}

  private update() {
    if (this.root) {
      this.root.render(
        <LocateMe
          onClick={() => {
            for (const viewport of Object.values(this.viewports)) {
              this.locateMe(viewport);
            }
          }}
        />
      );
    }
  }

  onRemove() {
    this.deck = undefined;
    this.root = undefined;
  }

  private locateMe(viewport: Viewport) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const nextViewState = {
          ...viewport,
          zoom: 13,
          pitch: 0,
          bearing: 0,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // @ts-expect-error Using private method temporary until there's a public one
        this.deck._onViewStateChange({
          viewId: viewport.id,
          viewState: nextViewState,
          interactionState: {},
        });
      });
    } else {
      // do something usefull
    }
  }
}

export default LocateWidget;
