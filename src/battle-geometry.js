// Model-independent conventions: local -Z is the bow, +Y is up; lengths are world units.
export function weaponPosition(ship, length) {
  if (!ship.weaponMount || !ship.facing) return [...ship.position];
  const [fx, fy, fz] = ship.facing, horizontal = Math.hypot(fx, fz);
  const right = horizontal > 1e-8 ? [-fz / horizontal, 0, fx / horizontal] : [1, 0, 0];
  const up = [-right[2] * fy, right[2] * fx - right[0] * fz, right[0] * fy];
  const [x, y, z] = ship.weaponMount;
  return ship.position.map((p, i) => p + length * (right[i] * x + up[i] * y - ship.facing[i] * z));
}

export function turnToward(facing, aim, radians) {
  const dot = Math.max(-1, Math.min(1, facing.reduce((n, v, i) => n + v * aim[i], 0)));
  const angle = Math.acos(dot);
  if (angle <= radians) return [...aim];
  // A deterministic intermediate axis also handles a direct 180-degree reversal.
  let tangent = aim.map((v, i) => v - facing[i] * dot);
  let length = Math.hypot(...tangent);
  if (length < 1e-8) { tangent = [-facing[2], 0, facing[0]]; length = Math.hypot(...tangent); }
  if (length < 1e-8) { tangent = [0, -facing[2], facing[1]]; length = Math.hypot(...tangent); }
  const c = Math.cos(radians), s = Math.sin(radians);
  return facing.map((v, i) => v * c + tangent[i] / length * s);
}
