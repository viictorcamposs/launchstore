const db = require ( '../../config/db' )
const { hash } = require('bcryptjs')

module.exports = {
    async findOne (filters) {
        try {
            let query = `SELECT * FROM users`
    
            Object.keys(filters).map(key => {
                query = `${query} ${key}`
    
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`
                })
            })
    
            const results = await db.query(query)
            return results.rows[0] 
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    cpf_cnpj,
                    cep,
                    address
                ) VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id
            `
            // criptografia de senhas
            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.address,
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async update(id, fields) {
        try {
            let query = `UPDATE users SET`
        
            Object.keys(fields).map(async (key, index, array) => {
                if((index + 1) < array.length) {
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
    
                await db.query(query)
                return
            })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}