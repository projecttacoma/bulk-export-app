export const mandatoryElements: Record<string, string[]> = {
  Account: ['status'],
  ActivityDefinition: ['status'],
  AdverseEvent: ['actuality', 'subject'],
  AllergyIntolerance: ['patient'],
  Appointment: ['status', 'participant'],
  AppointmentResponse: ['appointment', 'participantStatus'],
  AuditEvent: ['type', 'recorded', 'agent', 'source'],
  Basic: ['code'],
  Binary: ['contentType'],
  BiologicallyDerivedProduct: [],
  BodyStructure: ['patient'],
  Bundle: ['type'],
  CapabilityStatement: ['status', 'date', 'kind', 'fhirVersion', 'format'],
  CarePlan: ['status', 'intent', 'subject'],
  CareTeam: [],
  CatalogEntry: ['orderable', 'referencedItem'],
  ChargeItem: ['status', 'code', 'subject'],
  ChargeItemDefinition: ['url', 'status'],
  Claim: ['status', 'type', 'use', 'patient', 'created', 'provider', 'priority', 'insurance'],
  ClaimResponse: ['status', 'type', 'use', 'patient', 'created', 'insurer', 'outcome'],
  ClinicalImpression: ['status', 'subject'],
  CodeSystem: ['status', 'content'],
  Communication: ['status'],
  CommunicationRequest: ['status'],
  CompartmentDefinition: ['url', 'name', 'status', 'code', 'search'],
  Composition: ['status', 'type', 'date', 'author', 'title'],
  ConceptMap: ['status'],
  Condition: ['subject'],
  Consent: ['status', 'scope', 'category'],
  Contract: [],
  Coverage: ['status', 'beneficiary', 'payor'],
  CoverageEligibilityRequest: ['status', 'purpose', 'patient', 'created', 'insurer'],
  CoverageEligibilityResponse: ['status', 'purpose', 'patient', 'created', 'request', 'outcome', 'insurer'],
  DetectedIssue: ['status'],
  Device: [],
  DeviceDefinition: [],
  DeviceMetric: ['type', 'category'],
  DeviceRequest: ['intent', 'code[x]', 'subject'],
  DeviceUseStatement: ['status', 'subject', 'device'],
  DiagnosticReport: ['status', 'code'],
  DocumentManifest: ['status', 'content'],
  DocumentReference: ['status', 'content'],
  EffectEvidenceSynthesis: ['status', 'population', 'exposure', 'exposureAlternative', 'outcome'],
  Encounter: ['status', 'class'],
  Endpoint: ['status', 'connectionType', 'payloadType', 'address'],
  EnrollmentRequest: [],
  EnrollmentResponse: [],
  EpisodeOfCare: ['status', 'patient'],
  EventDefinition: ['status', 'trigger'],
  Evidence: ['status', 'exposureBackground'],
  EvidenceVariable: ['status', 'characteristic'],
  ExampleScenario: ['status'],
  ExplanationOfBenefit: ['status', 'type', 'use', 'patient', 'created', 'insurer', 'provider', 'outcome', 'insurance'],
  FamilyMemberHistory: ['status', 'patient', 'relationship'],
  Flag: ['status', 'code', 'subject'],
  Goal: ['lifecycleStatus', 'description', 'subject'],
  GraphDefinition: ['name', 'status', 'start'],
  Group: ['type', 'actual'],
  GuidanceResponse: ['module[x]', 'status'],
  HealthcareService: [],
  ImagingStudy: ['status', 'subject'],
  Immunization: ['status', 'vaccineCode', 'patient', 'occurrence[x]'],
  ImmunizationEvaluation: ['status', 'patient', 'targetDisease', 'immunizationEvent', 'doseStatus'],
  ImmunizationRecommendation: ['patient', 'date', 'recommendation'],
  ImplementationGuide: ['url', 'name', 'status', 'packageId', 'fhirVersion'],
  InsurancePlan: [],
  Invoice: ['status'],
  Library: ['status', 'type'],
  Linkage: ['item'],
  List: ['status', 'mode'],
  Location: [],
  Measure: ['status'],
  MeasureReport: ['status', 'type', 'measure', 'period'],
  Media: ['status', 'content'],
  Medication: [],
  MedicationAdministration: ['status', 'medication[x]', 'subject', 'effective[x]'],
  MedicationDispense: ['status', 'medication[x]'],
  MedicationKnowledge: [],
  MedicationRequest: ['status', 'intent', 'medication[x]', 'subject'],
  MedicationStatement: ['status', 'medication[x]', 'subject'],
  MedicinalProduct: ['name'],
  MedicinalProductAuthorization: [],
  MedicinalProductContraindication: [],
  MedicinalProductIndication: [],
  MedicinalProductIngredient: ['role'],
  MedicinalProductInteraction: [],
  MedicinalProductManufactured: ['manufacturedDoseForm', 'quantity'],
  MedicinalProductPackaged: ['packageItem'],
  MedicinalProductPharmaceutical: ['administrableDoseForm', 'routeOfAdministration'],
  MedicinalProductUndesirableEffect: [],
  MessageDefinition: ['status', 'date', 'event[x]'],
  MessageHeader: ['event[x]', 'source'],
  MolecularSequence: ['coordinateSystem'],
  NamingSystem: ['name', 'status', 'kind', 'date', 'uniqueId'],
  NutritionOrder: ['status', 'intent', 'patient', 'dateTime'],
  Observation: ['status', 'code'],
  ObservationDefinition: ['code'],
  OperationDefinition: ['name', 'status', 'kind', 'code', 'system', 'type', 'instance'],
  OperationOutcome: ['issue'],
  Organization: [],
  OrganizationAffiliation: [],
  Parameters: [],
  Patient: [],
  PaymentNotice: ['status', 'created', 'payment', 'recipient', 'amount'],
  PaymentReconciliation: ['status', 'created', 'paymentDate', 'paymentAmount'],
  Person: [],
  PlanDefinition: ['status'],
  Practitioner: [],
  PractitionerRole: [],
  Procedure: ['status', 'subject'],
  Provenance: ['target', 'recorded', 'agent'],
  Questionnaire: ['status'],
  QuestionnaireResponse: ['status'],
  RelatedPerson: ['patient'],
  RequestGroup: ['status', 'intent'],
  ResearchDefinition: ['status', 'population'],
  ResearchElementDefinition: ['status', 'type', 'characteristic'],
  ResearchStudy: ['status'],
  ResearchSubject: ['status', 'study', 'individual'],
  RiskAssessment: ['status', 'subject'],
  RiskEvidenceSynthesis: ['status', 'population', 'outcome'],
  Schedule: ['actor'],
  SearchParameter: ['url', 'name', 'status', 'description', 'code', 'base', 'type'],
  ServiceRequest: ['status', 'intent', 'subject'],
  Slot: ['schedule', 'status', 'start', 'end'],
  Specimen: [],
  SpecimenDefinition: [],
  StructureDefinition: ['url', 'name', 'status', 'kind', 'abstract', 'type'],
  StructureMap: ['url', 'name', 'status', 'group'],
  Subscription: ['status', 'reason', 'criteria', 'channel'],
  Substance: ['code'],
  SubstancePolymer: [],
  SubstanceProtein: [],
  SubstanceReferenceInformation: [],
  SubstanceSourceMaterial: [],
  SubstanceSpecification: [],
  SupplyDelivery: [],
  SupplyRequest: ['item[x]', 'quantity'],
  Task: ['status', 'intent'],
  TerminologyCapabilities: ['status', 'date', 'kind'],
  TestReport: ['status', 'testScript', 'result'],
  TestScript: ['url', 'name', 'status'],
  ValueSet: ['status'],
  VerificationResult: ['status'],
  VisionPrescription: ['status', 'created', 'patient', 'dateWritten', 'prescriber', 'lensSpecification']
};
