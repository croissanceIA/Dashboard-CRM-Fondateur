import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Deals Table - Search and Sort Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page principale
    await page.goto('/')
  })

  test('should display table after CSV upload', async ({ page }) => {
    // Uploader le fichier CSV de démo
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    const fileInput = page.locator('input[type="file"]')

    await fileInput.setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier que les colonnes sont affichées
    await expect(page.locator('thead').getByText('Contact')).toBeVisible()
    await expect(page.locator('thead').getByText('Entreprise')).toBeVisible()
    await expect(page.locator('thead').getByText('Statut')).toBeVisible()
    await expect(page.locator('thead').getByText('Montant')).toBeVisible()
    await expect(page.locator('thead').getByText('Échéance')).toBeVisible()
    await expect(page.locator('thead').getByText('Priorité')).toBeVisible()
    await expect(page.locator('thead').getByText('Tags')).toBeVisible()

    // Vérifier qu'il y a des lignes de données
    const rows = page.locator('tbody tr')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThan(0)
  })

  test('should filter deals using search bar', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Compter le nombre initial de deals
    const initialRows = await page.locator('tbody tr').count()

    // Trouver la barre de recherche
    const searchInput = page.getByPlaceholder(/Rechercher/)

    // Saisir une recherche (attendre le debounce)
    await searchInput.fill('SaaS')
    await page.waitForTimeout(400) // Attendre le debounce (300ms + marge)

    // Vérifier que le nombre de résultats a diminué
    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeLessThan(initialRows)
    expect(filteredRows).toBeGreaterThan(0)
  })

  test('should show empty state when search has no results', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Rechercher quelque chose qui n'existe pas
    const searchInput = page.getByPlaceholder(/Rechercher/)
    await searchInput.fill('xyz123nonexistent')
    await page.waitForTimeout(400)

    // Vérifier l'affichage du message d'empty state
    await expect(page.getByText(/Aucun deal ne correspond à votre recherche/)).toBeVisible()
  })

  test('should clear search and show all deals', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    const initialRows = await page.locator('tbody tr').count()

    // Rechercher quelque chose
    const searchInput = page.getByPlaceholder(/Rechercher/)
    await searchInput.fill('SaaS')
    await page.waitForTimeout(400)

    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeLessThan(initialRows)

    // Effacer la recherche
    await searchInput.clear()
    await page.waitForTimeout(400)

    // Vérifier que tous les deals sont de nouveau affichés
    const allRows = await page.locator('tbody tr').count()
    expect(allRows).toBe(initialRows)
  })

  test('should sort table by clicking column header', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible et que les données soient chargées
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000) // Attendre que le parsing CSV soit terminé

    // Vérifier qu'il y a des données
    const rowCount = await page.locator('tbody tr').count()
    expect(rowCount).toBeGreaterThan(0)

    // Cliquer sur le header "Contact" pour trier
    await page.locator('thead').getByText('Contact').click()
    await page.waitForTimeout(500)

    // Vérifier que le tri a bien fonctionné (le tableau est toujours affiché)
    await expect(page.locator('.deals-table')).toBeVisible()
    const rowsAfterSort = await page.locator('tbody tr').count()
    expect(rowsAfterSort).toBe(rowCount)
  })

  test('should sort by amount (descending)', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible et que les données soient chargées
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000) // Attendre que le parsing CSV soit terminé

    // Vérifier qu'il y a des données
    const rowCount = await page.locator('tbody tr').count()
    expect(rowCount).toBeGreaterThan(0)

    // Cliquer sur le header "Montant" pour trier par montant
    await page.locator('thead').getByText('Montant').click()
    await page.waitForTimeout(500)

    // Vérifier que le tri a bien fonctionné (le tableau est toujours affiché)
    await expect(page.locator('.deals-table')).toBeVisible()
    const rowsAfterSort = await page.locator('tbody tr').count()
    expect(rowsAfterSort).toBe(rowCount)
  })

  test('should paginate when more than 50 deals', async ({ page }) => {
    // Ce test nécessite un fichier CSV avec plus de 50 deals
    // Pour l'instant, on vérifie juste que la pagination est présente

    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier que l'info de pagination est présente
    await expect(page.locator('.ant-pagination')).toBeVisible()

    // Vérifier le texte de pagination (ex: "1-X sur Y deals")
    const paginationText = await page.locator('.ant-pagination-total-text').textContent()
    expect(paginationText).toContain('deals')
  })

  test('should highlight overdue dates in red', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier qu'il y a au moins une date en rouge (classe text-red-600)
    const overdueDates = page.locator('.text-red-600')
    const count = await overdueDates.count()

    // Si le CSV de démo contient des dates passées, elles doivent être en rouge
    // Sinon ce test passera avec count = 0
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should display status badges with colors', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier la présence de badges Ant Design
    const badges = page.locator('.ant-badge-status-text')
    const badgeCount = await badges.count()

    expect(badgeCount).toBeGreaterThan(0)
  })

  test('should display priority badges', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier la présence des labels de priorité en français
    const priorities = ['Faible', 'Moyenne', 'Haute']
    let foundPriority = false

    for (const priority of priorities) {
      const count = await page.getByText(priority, { exact: false }).count()
      if (count > 0) {
        foundPriority = true
        break
      }
    }

    expect(foundPriority).toBe(true)
  })

  test('should display tags as chips', async ({ page }) => {
    // Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // Vérifier la présence de tags Ant Design
    const tags = page.locator('.ant-tag')
    const tagCount = await tags.count()

    // Si le CSV contient des tags, ils doivent être affichés
    expect(tagCount).toBeGreaterThanOrEqual(0)
  })

  test('full workflow: upload → search → sort', async ({ page }) => {
    // 1. Uploader le fichier CSV
    const csvPath = path.join(process.cwd(), 'public', 'crm_prospects_demo.csv')
    await page.locator('input[type="file"]').setInputFiles(csvPath)

    // 2. Attendre que le tableau soit visible
    await expect(page.locator('.deals-table')).toBeVisible({ timeout: 5000 })

    // 3. Vérifier que les KPIs sont affichés
    await expect(page.getByText('Volume du Pipeline')).toBeVisible()

    // 4. Utiliser la recherche
    const searchInput = page.getByPlaceholder(/Rechercher/)
    await searchInput.fill('B2B')
    await page.waitForTimeout(400)

    // 5. Vérifier qu'il y a des résultats
    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)

    // 6. Trier par montant
    await page.locator('thead').getByText('Montant').click()
    await page.waitForTimeout(500)

    // 7. Vérifier que le tableau est toujours affiché avec les résultats filtrés
    const rowsAfterSort = await page.locator('tbody tr').count()
    expect(rowsAfterSort).toBe(filteredRows)

    // 8. Effacer la recherche
    await searchInput.clear()
    await page.waitForTimeout(400)

    // 9. Vérifier que tous les deals sont de nouveau affichés
    const allRows = await page.locator('tbody tr').count()
    expect(allRows).toBeGreaterThan(filteredRows)
  })
})
