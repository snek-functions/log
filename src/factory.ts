import { makeFn } from "@snek-at/functions";
import type { SpawnOptionsWithoutStdio } from "child_process";

export const fn = makeFn({
  url: "https://<your-url>/graphql",
});

interface ProxyOptions {
  host?: string;
  port?: number;
}

export const sendToProxy = async <FunctionArgs, FunctionReturn>(
  fnName: string,
  args?: FunctionArgs,
  options?: ProxyOptions
): Promise<FunctionReturn> => {
  const host = options?.host || "127.0.0.1";
  const port = options?.port || 12000;

  const net = await import("net");

  // async await net client
  const response = new Promise<FunctionReturn>((resolve, reject) => {
    const client = new net.Socket();
    client.connect(port, host, () => {
      const data = JSON.stringify({
        fnName,
        data: args,
      });

      client.write(data);
      client.end();
    });

    client.on("data", (data) => {
      const dataStr = data.toString();

      try {
        console.log(dataStr);
        const parsedData = JSON.parse(dataStr);

        resolve(parsedData);
      } catch (err) {
        resolve(dataStr as any);
      } finally {
        client.end();
      }
    });

    client.on("error", (err) => {
      reject(err);
    });
  });

  return response;
};

export async function spawnChild(
  command: string,
  scriptName: string,
  args?: string[],
  options?: SpawnOptionsWithoutStdio
) {
  const { spawn } = await import("child_process");
  const { fileURLToPath } = await import("url");
  const { default: path, dirname } = await import("path");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // filepath relative to current file
  const scriptPath = path.resolve(__dirname, scriptName);

  const child = spawn(command, [scriptPath].concat(args || []), options);

  let data = "";
  for await (const chunk of child.stdout) {
    console.log("stdout chunk: " + chunk);
    data += chunk;
  }
  let error = "";
  for await (const chunk of child.stderr) {
    console.error("stderr chunk: " + chunk);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, _) => {
    child.on("close", resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }
  return data;
}
