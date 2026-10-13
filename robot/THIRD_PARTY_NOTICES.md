# Third-party software

Robot Lab is an independent viewer. It uses these bundled open-source libraries; no third-party CDN is required at runtime.

- Three.js 0.186.1 — MIT — https://github.com/mrdoob/three.js
- urdf-loader 0.13.1 — Apache-2.0 — https://github.com/gkjohnson/urdf-loaders
- fflate 0.8.3 — MIT — https://github.com/101arrowz/fflate

The software is provided without warranty. Full license texts are included in `licenses/`.

The built viewer retains the libraries' legal comments in `viewer.js.LEGAL.txt`.

## Model

`assets/zero-arm.zip` is an unchanged copy of the ZERO_ARM_urdf_online_verified.zip supplied by the site owner. It contains the original URDF and seven STL meshes. The model's mass properties and joint limits are placeholders; this viewer performs kinematic visualization, not physical simulation or hardware control.
