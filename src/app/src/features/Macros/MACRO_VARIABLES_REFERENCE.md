# Macro Variables Reference

A complete reference of all configuration settings available for use in gSender macros.

---

## Macro Variable Syntax

| Syntax | Purpose |
|--------|---------|
| `[variable]` | Substitute variable value into G-code |
| `%VAR = value` | Assign a value (line not sent to machine) |
| `%X=posx,Y=posy` | Multiple assignments on one line |

---

## Position Variables

| Variable | Description |
|----------|-------------|
| `[posx]` `[posy]` `[posz]` | Current work position (X, Y, Z) |
| `[posa]` `[posb]` `[posc]` | Work position for A, B, C axes |
| `[mposx]` `[mposy]` `[mposz]` | Machine position (X, Y, Z) |
| `[mposa]` `[mposb]` `[mposc]` | Machine position for A, B, C axes |

---

## Modal State Variables

Access via `modal.` prefix:

| Variable | Description |
|----------|-------------|
| `[modal.motion]` | G0, G1, G2, G3 (motion mode) |
| `[modal.wcs]` | G54-G59 (work coordinate system) |
| `[modal.plane]` | XY, ZX, YZ (plane selection) |
| `[modal.units]` | G20 (inches) or G21 (mm) |
| `[modal.distance]` | G90 (absolute) or G91 (incremental) |
| `[modal.feedrate]` | G93, G94, G95 (feedrate mode) |
| `[modal.spindle]` | M3, M4, M5 (spindle state) |
| `[modal.coolant]` | M7, M8, M9 (coolant state) |

---

## Machine Parameters

Run `$#` then `%wait` before accessing these:

| Variable | Description |
|----------|-------------|
| `[params.PRB.x/y/z]` | Probe position |
| `[params.G54.x/y/z]` | G54 work offset |
| `[params.G55.x/y/z]` | G55 work offset (same for G56-G59) |
| `[params.TLO]` | Tool length offset |

---

## Bounding Box Variables

From loaded G-code file:

| Variable | Description |
|----------|-------------|
| `[xmin]` `[xmax]` | X extent of loaded file |
| `[ymin]` `[ymax]` | Y extent of loaded file |
| `[zmin]` `[zmax]` | Z extent of loaded file |

---

## Tool & Feedrate

| Variable | Description |
|----------|-------------|
| `[tool]` | Current tool number |
| `[programFeedrate]` | Current feedrate |

---

## Global Variables

Persist across macro calls:

```gcode
%global.myVar = 10
%savedTool = global.myVar
```

---

## Control Commands

| Command | Description |
|---------|-------------|
| `%wait` | Wait for planner queue to empty |
| `%pre_complete` | Pre-hook completion marker |
| `%toolchange_complete` | Tool change completion marker |

---

## JavaScript Functions Available

`Math.*`, `Number()`, `parseFloat()`, `parseInt()`, `String()`, `JSON.*`, `Date`

---

## Examples

### Save position, move, return

```gcode
%X0=posx,Y0=posy,Z0=posz
G0 X10 Y10 Z5
G0 X[X0] Y[Y0] Z[Z0]
```

### Use math expressions

```gcode
G0 X[posx + 10] Y[Math.abs(posy)]
```

### Save/restore modal state

```gcode
%SAVED_WCS = modal.wcs
G54
; work here
[SAVED_WCS]
```

### Tool change with offset

```gcode
%prevTool = Number(global.tool) || 0, global.tool = tool
M6 T[tool]
$#
%wait
%Z_OFFSET = params.TLO
G0 Z[Z_OFFSET]
```

### Move to bounding box corners

```gcode
G0 X[xmin] Y[ymin]
G0 X[xmax] Y[ymax]
```
