/**
 * Flood MCP — wraps Open-Meteo Flood API (free, no auth)
 *
 * Tools:
 * - get_river_discharge: Get daily river discharge forecast for a location
 * - get_flood_forecast: Get comprehensive flood forecast including mean and max discharge
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://flood-api.open-meteo.com/v1';

type RawFloodResponse = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  daily_units: Record<string, string>;
  daily: Record<string, (number | null)[]>;
};

function formatFloodResponse(data: RawFloodResponse) {
  const dates = (data.daily['time'] ?? []) as unknown as string[];
  const variables = Object.keys(data.daily).filter((k) => k !== 'time');

  const days = dates.map((date, i) => {
    const entry: Record<string, unknown> = { date };
    for (const variable of variables) {
      entry[variable] = data.daily[variable]?.[i] ?? null;
    }
    return entry;
  });

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    units: data.daily_units,
    days,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_river_discharge',
    description:
      'Get daily river discharge forecast (m\u00b3/s) for a geographic location using the Open-Meteo Flood API.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location in decimal degrees.',
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location in decimal degrees.',
        },
        forecast_days: {
          type: 'number',
          description: 'Number of forecast days to retrieve (1\u201392). Defaults to 7.',
        },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_flood_forecast',
    description:
      'Get a comprehensive flood forecast including river discharge, mean discharge, and max discharge for a location.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          description: 'Latitude of the location in decimal degrees.',
        },
        longitude: {
          type: 'number',
          description: 'Longitude of the location in decimal degrees.',
        },
        forecast_days: {
          type: 'number',
          description: 'Number of forecast days to retrieve (1\u201392). Defaults to 16.',
        },
      },
      required: ['latitude', 'longitude'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_river_discharge':
      return getRiverDischarge(
        args.latitude as number,
        args.longitude as number,
        (args.forecast_days as number | undefined) ?? 7
      );
    case 'get_flood_forecast':
      return getFloodForecast(
        args.latitude as number,
        args.longitude as number,
        (args.forecast_days as number | undefined) ?? 16
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getRiverDischarge(latitude: number, longitude: number, forecast_days: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'river_discharge',
    forecast_days: String(forecast_days),
  });
  const res = await fetch(`${BASE_URL}/flood?${params}`);
  if (!res.ok) throw new Error(`Flood API error: ${res.status}`);
  const data = (await res.json()) as RawFloodResponse;
  return formatFloodResponse(data);
}

async function getFloodForecast(latitude: number, longitude: number, forecast_days: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'river_discharge,river_discharge_mean,river_discharge_max',
    forecast_days: String(forecast_days),
  });
  const res = await fetch(`${BASE_URL}/flood?${params}`);
  if (!res.ok) throw new Error(`Flood API error: ${res.status}`);
  const data = (await res.json()) as RawFloodResponse;
  return formatFloodResponse(data);
}

export default { tools, callTool } satisfies McpToolExport;
