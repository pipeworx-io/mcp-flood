# mcp-flood

Flood MCP — wraps Open-Meteo Flood API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_river_discharge` | Get daily river discharge forecast in cubic meters per second for a location. Returns discharge values with timestamps. Use to monitor water flow rates for flood risk assessment. |
| `get_flood_forecast` | Get multi-day flood forecast for a location with current, mean, and peak river discharge projections. Returns discharge statistics and severity assessment. Use to evaluate flood risk and timeline. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "flood": {
      "url": "https://gateway.pipeworx.io/flood/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Flood data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
