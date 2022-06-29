const log = (...values: any) => {
    console.log(new Date().toLocaleString(), ' - ', ...values)
}

const error = (...values: any) => {
    console.log(new Date().toLocaleString(), ' - ', ...values)
}

export default { log, error }
