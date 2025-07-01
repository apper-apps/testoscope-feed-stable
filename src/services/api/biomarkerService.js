import { toast } from 'react-toastify'

class BiomarkerService {
  constructor() {
    this.apperClient = null;
    this.isAdminMode = import.meta.env.VITE_ADMIN_MODE === 'true';
    if (this.isAdminMode) {
      this.initClient();
    }
  }

  initClient() {
    if (!this.isAdminMode) {
      throw new Error('Database access restricted to admin use only');
    }
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  checkAdminAccess() {
    if (!this.isAdminMode) {
      throw new Error('Database access restricted to admin use only');
    }
  }
async getAll() {
    if (!this.isAdminMode) {
      // Return mock data for non-admin users
      return this.getMockBiomarkers();
    }
    
    this.checkAdminAccess();
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('biomarker', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(item => this.formatBiomarkerData(item)) || [];
    } catch (error) {
      console.error('Error fetching biomarkers:', error);
      toast.error('Failed to load biomarkers');
      return [];
    }
  }

async getById(id) {
    if (!this.isAdminMode) {
      // Return mock data for non-admin users
      const mockBiomarkers = this.getMockBiomarkers();
      return mockBiomarkers.find(biomarker => biomarker.Id === parseInt(id, 10)) || null;
    }
    
    this.checkAdminAccess();
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('biomarker', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return this.formatBiomarkerData(response.data);
    } catch (error) {
      console.error(`Error fetching biomarker with ID ${id}:`, error);
      return null;
    }
  }

async getByCategory(category) {
    if (!this.isAdminMode) {
      // Return filtered mock data for non-admin users
      const mockBiomarkers = this.getMockBiomarkers();
      return mockBiomarkers.filter(biomarker => biomarker.category === category);
    }
    
    this.checkAdminAccess();
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('biomarker', params);
      
      if (!response.success) {
        return [];
      }
      
      return response.data?.map(item => this.formatBiomarkerData(item)) || [];
    } catch (error) {
      console.error('Error fetching biomarkers by category:', error);
      return [];
    }
  }

formatBiomarkerData(item) {
    try {
      // Safe JSON parsing helper
      const safeJsonParse = (value, fallback) => {
        if (!value) return fallback;
        if (typeof value === 'object') return value;
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            return fallback;
          }
        }
        return fallback;
      };

      return {
        Id: item.Id || item.id,
        name: item.Name || item.name || '',
        category: item.category || '',
        units: safeJsonParse(item.units, []),
        optimalRange: safeJsonParse(item.optimal_range || item.optimalRange, {}),
        ageAdjustment: safeJsonParse(item.age_adjustment || item.ageAdjustment, null),
        description: item.description || ''
      };
    } catch (error) {
      console.error('Error formatting biomarker data:', error, 'Item:', item);
      // Return a safe fallback object with expected structure
      return {
        Id: item.Id || item.id || 0,
        name: item.Name || item.name || 'Unknown',
        category: item.category || 'Unknown',
        units: [],
        optimalRange: {},
        ageAdjustment: null,
        description: item.description || ''
      };
    }
  }

async calculateStatus(markerId, value, age = 35) {
    const biomarker = await this.getById(markerId);
    if (!biomarker) return 'unknown';

    const ageAdjustedRanges = this.getAgeAdjustedRanges(biomarker, age);

    if (value < ageAdjustedRanges.low) return 'low';
    if (value < ageAdjustedRanges.suboptimalLow) return 'suboptimal-low';
    if (value <= ageAdjustedRanges.optimal) return 'optimal';
    if (value <= ageAdjustedRanges.suboptimalHigh) return 'suboptimal-high';
    return 'high';
  }

  getMockBiomarkers() {
    return [
      {
        Id: 1,
        name: "Total Testosterone",
        category: "Core Hormones",
        units: ["ng/dL", "nmol/L"],
        optimalRange: {
          low: 300,
          suboptimalLow: 450,
          optimal: 700,
          suboptimalHigh: 900,
          high: 1200
        },
        ageAdjustment: {
          rate: -1.2,
          startAge: 30
        },
        description: "Primary male hormone responsible for muscle mass, bone density, and sexual function"
      },
      {
        Id: 2,
        name: "Free Testosterone",
        category: "Core Hormones",
        units: ["pg/mL", "pmol/L"],
        optimalRange: {
          low: 6.5,
          suboptimalLow: 9.0,
          optimal: 15.0,
          suboptimalHigh: 25.0,
          high: 30.0
        },
        ageAdjustment: {
          rate: -1.0,
          startAge: 30
        },
        description: "Bioavailable testosterone not bound to proteins"
      },
      {
        Id: 3,
        name: "Luteinizing Hormone (LH)",
        category: "Core Hormones",
        units: ["mIU/mL", "IU/L"],
        optimalRange: {
          low: 1.7,
          suboptimalLow: 3.0,
          optimal: 6.0,
          suboptimalHigh: 8.6,
          high: 12.0
        },
        ageAdjustment: null,
        description: "Pituitary hormone that stimulates testosterone production"
      },
      {
        Id: 4,
        name: "Follicle Stimulating Hormone (FSH)",
        category: "Core Hormones",
        units: ["mIU/mL", "IU/L"],
        optimalRange: {
          low: 1.5,
          suboptimalLow: 2.5,
          optimal: 7.0,
          suboptimalHigh: 12.4,
          high: 18.0
        },
        ageAdjustment: null,
        description: "Pituitary hormone that regulates sperm production"
      },
      {
        Id: 5,
        name: "Sex Hormone Binding Globulin (SHBG)",
        category: "Core Hormones",
        units: ["nmol/L", "μg/dL"],
        optimalRange: {
          low: 16,
          suboptimalLow: 20,
          optimal: 35,
          suboptimalHigh: 55,
          high: 75
        },
        ageAdjustment: {
          rate: 1.2,
          startAge: 40
        },
        description: "Protein that binds to testosterone, affecting bioavailable levels"
      },
      {
        Id: 6,
        name: "Estradiol (E2)",
        category: "Core Hormones",
        units: ["pg/mL", "pmol/L"],
        optimalRange: {
          low: 8,
          suboptimalLow: 15,
          optimal: 25,
          suboptimalHigh: 35,
          high: 50
        },
        ageAdjustment: null,
        description: "Primary estrogen hormone, important for bone health and cognitive function"
      },
      {
        Id: 7,
        name: "Thyroid Stimulating Hormone (TSH)",
        category: "Thyroid",
        units: ["μIU/mL", "mIU/L"],
        optimalRange: {
          low: 0.3,
          suboptimalLow: 1.0,
          optimal: 2.0,
          suboptimalHigh: 3.0,
          high: 5.0
        },
        ageAdjustment: null,
        description: "Pituitary hormone that regulates thyroid function"
      },
      {
        Id: 8,
        name: "Free T4 (Thyroxine)",
        category: "Thyroid",
        units: ["ng/dL", "pmol/L"],
        optimalRange: {
          low: 0.8,
          suboptimalLow: 1.0,
          optimal: 1.3,
          suboptimalHigh: 1.6,
          high: 2.0
        },
        ageAdjustment: null,
        description: "Primary thyroid hormone affecting metabolism"
      },
      {
        Id: 9,
        name: "Free T3 (Triiodothyronine)",
        category: "Thyroid",
        units: ["pg/mL", "pmol/L"],
        optimalRange: {
          low: 2.3,
          suboptimalLow: 2.8,
          optimal: 3.4,
          suboptimalHigh: 4.0,
          high: 4.8
        },
        ageAdjustment: null,
        description: "Active thyroid hormone responsible for cellular metabolism"
      },
      {
        Id: 10,
        name: "Cortisol (Morning)",
        category: "Metabolic",
        units: ["μg/dL", "nmol/L"],
        optimalRange: {
          low: 6.0,
          suboptimalLow: 10.0,
          optimal: 16.0,
          suboptimalHigh: 20.0,
          high: 25.0
        },
        ageAdjustment: null,
        description: "Stress hormone that should be highest in the morning"
      },
      {
        Id: 11,
        name: "DHEA-S",
        category: "Metabolic",
        units: ["μg/dL", "μmol/L"],
        optimalRange: {
          low: 150,
          suboptimalLow: 250,
          optimal: 400,
          suboptimalHigh: 550,
          high: 700
        },
        ageAdjustment: {
          rate: -2.0,
          startAge: 30
        },
        description: "Adrenal hormone precursor with anti-aging properties"
      },
      {
        Id: 12,
        name: "IGF-1",
        category: "Metabolic",
        units: ["ng/mL", "μg/L"],
        optimalRange: {
          low: 115,
          suboptimalLow: 150,
          optimal: 220,
          suboptimalHigh: 280,
          high: 350
        },
        ageAdjustment: {
          rate: -1.5,
          startAge: 25
        },
        description: "Growth factor that declines with age, important for muscle and bone health"
      }
    ];
  }

  getAgeAdjustedRanges(biomarker, age) {
    const baseRanges = biomarker.optimalRange;
    const ageAdjustment = biomarker.ageAdjustment || { rate: 0, startAge: 30 };
    
    if (age <= ageAdjustment.startAge) {
      return baseRanges;
    }

    const yearsAfterStart = age - ageAdjustment.startAge;
    const adjustmentFactor = 1 + (ageAdjustment.rate * yearsAfterStart / 100);

    return {
      ...baseRanges,
      low: baseRanges.low * adjustmentFactor,
      suboptimalLow: baseRanges.suboptimalLow * adjustmentFactor,
      optimal: baseRanges.optimal * adjustmentFactor,
      suboptimalHigh: baseRanges.suboptimalHigh * adjustmentFactor,
      high: baseRanges.high * adjustmentFactor
    };
  }
}

export default new BiomarkerService()