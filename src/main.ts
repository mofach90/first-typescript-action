import * as core from '@actions/core'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    const berlinTimeOffset = 2 * 60 // UTC+2, so 2 hours converted to minutes
    const localTime = new Date()
    const utcTime = localTime.getTime() + localTime.getTimezoneOffset() * 60000 // Get the UTC time in milliseconds
    const berlinTime = new Date(utcTime + berlinTimeOffset * 60000) // Add the offset for Berlin time
    core.setOutput('time', berlinTime.toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
