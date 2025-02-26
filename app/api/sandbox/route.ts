import { FragmentSchema } from '@/lib/schema'
import { ExecutionResultInterpreter, ExecutionResultWeb } from '@/lib/types'
import { Sandbox } from '@e2b/code-interpreter'

const sandboxTimeout = 2 * 60 * 1000 // 10 minute in ms

export const maxDuration = 60

export async function POST(req: Request) {
  const {
    fragment,
    userID,
    apiKey,
  }: { fragment: FragmentSchema; userID: string; apiKey?: string } =
    await req.json()
  console.log('fragment', fragment)
  console.log('userID', userID)
  // console.log('apiKey', apiKey)

  // Create a interpreter or a sandbox
  const sbx = await Sandbox.create(fragment.template, {
    metadata: { template: fragment.template, userID: userID },
    timeoutMs: sandboxTimeout,
    apiKey,
  })
  if (!sbx) {
    console.error('Sandbox creation failed');
    return new Response(JSON.stringify({ error: 'Failed to create sandbox' }), { status: 500 });
  }

  try {
    const result = await sbx.commands.run('npm install @emotion/react @emotion/css');
    if (result.exitCode === 0) {
      console.log('emotion installed successfully.');
    } else {
      console.error('Installation emotion failed:', result.stderr || 'Unknown error');
      throw new Error('emotion installation failed with exit code ' + result.exitCode);
    }
  } catch (err) {
    console.error('Error during dependency installation:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to install emotion', details: err }),
      { status: 500 }
    );
  }
  if (fragment.has_additional_dependencies) {
    try {
      const result = await sbx.commands.run(fragment.install_dependencies_command);
      if (result.exitCode === 0) {
        console.log('Dependencies installed successfully.');
      } else {
        console.error('Installation command failed:', result.stderr || 'Unknown error');
        throw new Error('Dependencies installation failed with exit code ' + result.exitCode);
      }
    } catch (err) {
      console.error('Error during dependency installation:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to install dependencies', details: err }),
        { status: 500 }
      );
    }

  }

  // Copy code to fs
  if (fragment.code && Array.isArray(fragment.code)) {
    for (const file of fragment.code) {
      try {
        await sbx.files.write(file.file_path, file.file_content);
        console.log(`Copied file to ${file.file_path} in ${sbx.sandboxId}`);
      } catch (err) {
        console.error(`Failed to copy file to ${file.file_path}:`, err);
        return new Response(
          JSON.stringify({ error: 'Failed to write file', file: file.file_path, details: err }),
          { status: 500 }
        );
      }
    }
  }
  else {
    await sbx.files.write(fragment.file_path, fragment.code)
    console.log(`Copied file to ${fragment.file_path} in ${sbx.sandboxId}`)
  }

  // Execute code or return a URL to the running sandbox
  if (fragment.template === 'code-interpreter-v1') {
    const { logs, error, results } = await sbx.runCode(fragment.code || '')

    return new Response(
      JSON.stringify({
        sbxId: sbx?.sandboxId,
        template: fragment.template,
        stdout: logs.stdout,
        stderr: logs.stderr,
        runtimeError: error,
        cellResults: results,
      } as ExecutionResultInterpreter),
    )
  }
  const result = await sbx.commands.run('cd /home/user');
  console.log("res:", result)
  // 启动服务 (例如：启动一个 Python HTTP 服务)
  const process = await sbx.commands.run(
    'npm run build && npm run start',
    { background: true } // 后台运行服务
  );
  await new Promise((resolve) => setTimeout(resolve, 5000)); // 等待 2 秒
  console.log("process:", process)
  return new Response(
    JSON.stringify({
      sbxId: sbx?.sandboxId,
      template: fragment.template,
      url: `https://${sbx?.getHost(fragment.port || 3000)}`,
    } as unknown as ExecutionResultWeb),
  )
}
