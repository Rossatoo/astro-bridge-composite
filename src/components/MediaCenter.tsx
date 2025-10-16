import { useEffect, useMemo, useState } from "react";
import { MenuGroup } from "./patterns/composite/MenuGroup";
import { MenuItem } from "./patterns/composite/MenuItem";
import type { MenuComponent } from "./patterns/composite/MenuComponent";
import { Tv } from "./patterns/bridge/Tv";
import { Radio } from "./patterns/bridge/Radio";
import { Projector } from "./patterns/bridge/Projector";
import { Remote } from "./patterns/bridge/Remote";
import { AdvancedRemote } from "./patterns/bridge/AdvancedRemote";
import type { Device } from "./patterns/bridge/Device";

type Selection = { path: string[]; device?: Device };

function buildMenu(): { root: MenuGroup } {
  const casa = new MenuGroup("Casa");
  const sala = new MenuGroup("Sala");
  const quarto = new MenuGroup("Quarto");
  const escritorio = new MenuGroup("Escritório");

  sala
    .add(new MenuItem("TV da Sala", new Tv("TV da Sala")))
    .add(new MenuItem("Rádio da Sala", new Radio("Rádio da Sala")));
  escritorio.add(new MenuItem("Projetor", new Projector("Projetor")));

  casa.add(sala).add(quarto).add(escritorio);
  return { root: casa };
}

const DeviceNode: React.FC<{
  node: MenuComponent;
  onPick: (sel: Selection) => void;
  path?: string[];
}> = ({ node, onPick, path = [] }) => {
  const curr = [...path, node.getName()];

  if (node.isLeaf()) {
    const leaf = node as MenuItem;
    return (
      <div className="node">
        <div className="name">
          {leaf.print()}{" "}
          <button className="primary" onClick={() => onPick({ path: curr, device: leaf.getDevice() })}>
            Selecionar
          </button>
        </div>
      </div>
    );
  }

  const group = node as MenuGroup;
  return (
    <div className="node">
      <div className="name">+ {group.getName()}/</div>
      <div style={{ marginLeft: 12 }}>
        {group.getChildren().map((c, i) => (
          <DeviceNode key={i} node={c} onPick={onPick} path={curr} />
        ))}
      </div>
    </div>
  );
};

const MediaCenter: React.FC = () => {
  const { root } = useMemo(buildMenu, []);

  // Bridge: diferentes Abstractions (Remote/AdvancedRemote) × Devices
  const [remoteType, setRemoteType] = useState<"basic" | "advanced">("advanced");
  const [device, setDevice] = useState<Device | undefined>(undefined);

  // instância do Remote coerente com o tipo selecionado
  const remote = useMemo(() => {
    const d = device ?? new Tv("TV (temporária)");
    return remoteType === "advanced" ? new AdvancedRemote(d) : new Remote(d);
  }, [remoteType, device]);

  // estado "ao vivo" do device (para re-render após cada ação)
  const [state, setState] = useState(remote.snapshot());
  const apply = (fn: () => void) => { fn(); setState(remote.snapshot()); };

  // quando trocar de remote/device, sincroniza snapshot
  useEffect(() => { setState(remote.snapshot()); }, [remote]);

  const onPick = (sel: Selection) => { setDevice(sel.device); };

  return (
    <div className="grid">
      {/* ESQUERDA: Árvore (Composite) */}
      <section className="panel">
        <h3>Árvore de dispositivos (Composite)</h3>
        <div className="tree">
          <DeviceNode node={root} onPick={onPick} />
        </div>
        <p className="small">
          <strong>Composite:</strong> <code className="code">MenuGroup</code> (Composite) contém{" "}
          <code className="code">MenuComponent</code> que podem ser <code className="code">MenuItem</code> (Leaf) ou outros{" "}
          <code className="code">MenuGroup</code>.
        </p>
      </section>

      {/* DIREITA: Controles (Bridge) */}
      <section className="panel">
        <h3>Controles (Bridge)</h3>

        <div className="row" style={{ marginBottom: 10 }}>
          <label>Controle:&nbsp;</label>
          <select
            className="select"
            onChange={(e) => setRemoteType(e.target.value as any)}
            value={remoteType}
          >
            <option value="basic">Básico (Remote)</option>
            <option value="advanced">Avançado (AdvancedRemote)</option>
          </select>
        </div>

        <div className="btns" style={{ marginBottom: 10 }}>
          <button onClick={() => apply(() => remote.togglePower())}>Power</button>
          <button onClick={() => apply(() => remote.volumeDown())}>Vol −</button>
          <button onClick={() => apply(() => remote.volumeUp())}>Vol +</button>
          <button onClick={() => apply(() => remote.channelDown())}>Canal −</button>
          <button onClick={() => apply(() => remote.channelUp())}>Canal +</button>
          {remote instanceof AdvancedRemote && (
            <>
              <button onClick={() => apply(() => (remote as AdvancedRemote).mute())}>Mute</button>
              <button onClick={() => apply(() => (remote as AdvancedRemote).macroMovieNight())}>Movie Night</button>
            </>
          )}
        </div>

        <div className="code" style={{ marginBottom: 8 }}>
          <div><strong>Device:</strong> {state.name}</div>
          <div>
            <strong>Ligado:</strong>{" "}
            <span className={"state " + (state.on ? "ok" : "err")}>{state.on ? "SIM" : "NÃO"}</span>
          </div>
          <div style={{ marginTop: 6 }}>
            <strong>Volume:</strong> {state.volume}
            <div className="meter"><div style={{ width: `${Math.max(0, Math.min(100, state.volume))}%` }} /></div>
          </div>
          <div style={{ marginTop: 6 }}>
            <strong>Canal:</strong> {state.channel}
          </div>
        </div>

        <p className="small">
          <strong>Bridge:</strong> <code className="code">Remote</code> (Abstraction) invoca operações de{" "}
          <code className="code">Device</code> (Implementor) sem conhecer detalhes de TV/Rádio/Projetor.{" "}
          <code className="code">AdvancedRemote</code> (RefinedAbstraction) adiciona recursos (mute/macro).
        </p>
      </section>
    </div>
  );
};

export default MediaCenter;
