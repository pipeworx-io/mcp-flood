# mcp-flood

MCP server for river discharge and flood forecasts via the [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `get_river_discharge` | Get daily river discharge forecast for a geographic location |
| `get_flood_forecast` | Get comprehensive flood forecast including mean and max discharge |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "flood_get_river_discharge",
      "arguments": { "latitude": 47.37, "longitude": 8.55 }
    },
    "id": 1
  }'
```

## License

MIT
