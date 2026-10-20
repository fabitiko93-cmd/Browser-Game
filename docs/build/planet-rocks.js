import { Vector3, Quaternion, Matrix4 } from 'three';
import { regionGroundHeight } from './planet-blueprint.js';

// Preserve the actual scan's shape. Bury its irregular lowest quarter rather
// than treating a single bounding-box point as a flat, rectangular foundation.
export function rockFootprint(geometry) {
  geometry.computeBoundingBox();
  const height = geometry.boundingBox.max.y, position = geometry.attributes.position, points = [];
  for (let i = 0; i < position.count; i++) if (position.getY(i) <= height * .24) points.push(position.getX(i), position.getY(i), position.getZ(i));
  if (!points.length) throw new Error('Felsmodell ohne Auflagefläche.');
  return { points: new Float32Array(points), height };
}

export function fitRockToGround(region, rock, footprint) {
  const span = Math.max(2, rock.scale * .35);
  const dx = (regionGroundHeight(region, rock.x + span, rock.z) - regionGroundHeight(region, rock.x - span, rock.z)) / (span * 2);
  const dz = (regionGroundHeight(region, rock.x, rock.z + span) - regionGroundHeight(region, rock.x, rock.z - span)) / (span * 2);
  const normal = new Vector3(-dx, 1, -dz).normalize();
  const tilt = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal);
  const rotation = tilt.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rock.rotation));
  const scale = new Vector3(rock.scale, rock.scale * (.88 + rock.variant * .1), rock.scale);
  const p = new Vector3(); let y = Infinity;
  for (let i = 0; i < footprint.points.length; i += 3) {
    p.fromArray(footprint.points, i).multiply(scale).applyQuaternion(rotation);
    y = Math.min(y, regionGroundHeight(region, rock.x + p.x, rock.z + p.z) - p.y);
  }
  y -= .06 + rock.scale * .008;
  return { matrix: new Matrix4().compose(new Vector3(rock.x, y, rock.z), rotation, scale), y, rotation, scale, normal };
}
