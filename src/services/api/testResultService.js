const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TestResultService {
  constructor() {
    this.storageKey = 'testoscope_results'
  }

  async getAll() {
    await delay(200)
    const stored = sessionStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  async getById(id) {
    await delay(200)
    const data = await this.getAll()
    return data.find(item => item.Id === parseInt(id, 10)) || null
  }

  async create(item) {
    await delay(300)
    const data = await this.getAll()
    const maxId = data.length > 0 ? Math.max(...data.map(d => d.Id)) : 0
    const newItem = { ...item, Id: maxId + 1 }
    const updatedData = [...data, newItem]
    sessionStorage.setItem(this.storageKey, JSON.stringify(updatedData))
    return { ...newItem }
  }

  async update(id, updates) {
    await delay(300)
    const data = await this.getAll()
    const index = data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Test result not found')
    
    const updatedItem = { ...data[index], ...updates, Id: data[index].Id }
    data[index] = updatedItem
    sessionStorage.setItem(this.storageKey, JSON.stringify(data))
    return { ...updatedItem }
  }

  async delete(id) {
    await delay(300)
    const data = await this.getAll()
    const filteredData = data.filter(item => item.Id !== parseInt(id, 10))
    sessionStorage.setItem(this.storageKey, JSON.stringify(filteredData))
    return true
  }

  async saveTestResults(results) {
    await delay(300)
    sessionStorage.setItem('testoscope_current_results', JSON.stringify(results))
    return results
  }

  async getCurrentResults() {
    await delay(200)
    const stored = sessionStorage.getItem('testoscope_current_results')
    return stored ? JSON.parse(stored) : {}
  }

  async clearCurrentResults() {
    await delay(200)
    sessionStorage.removeItem('testoscope_current_results')
    return true
  }
}

export default new TestResultService()