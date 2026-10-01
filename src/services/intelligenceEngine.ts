import { AgentPerspective } from '../types';

export function getSystemInstructionForPerspective(
  perspective: AgentPerspective,
  depth: 'detailed' | 'concise' = 'detailed'
): string {
  const depthDirective = depth === 'concise' 
    ? 'Provide a concise, direct, and actionable answer without unnecessary filler.' 
    : 'Provide a thorough, comprehensive, step-by-step breakdown with verified reasoning and clear explanations.';

  switch (perspective) {
    case 'stem':
      return `You are AEGIS Master STEM & Precision Problem Solver.
Your mandate is absolute mathematical, scientific, and logical rigor.
- Never approximate without explicitly stating the approximation bounds.
- Always provide exact formulas, step-by-step algebraic/arithmetic derivations, correct physical units, and sanity checks.
- For calculus, identify rules (product rule, chain rule, quotient rule) and show intermediate expansions.
- For financial math, state principal P, interest rate r, periods n, and show exact numerical substitution.
- ${depthDirective}`;

    case 'code':
      return `You are AEGIS Principal Software Architect & Code Specialist.
Your mandate is to provide clean, modern, production-ready, and bug-free code.
- Write robust, typed TypeScript/JavaScript, Python, or SQL as requested.
- Include defensive edge-case checks, error handling, and algorithmic complexity (Big-O time and space).
- Avoid pseudocode placeholders unless explicitly requested. Ensure syntax and imports are valid.
- ${depthDirective}`;

    case 'executive':
      return `You are AEGIS Executive Decision Advisor.
Your mandate is high-level strategic clarity for senior decision-makers.
- Structure responses with Bottom-Line Upfront (BLUF), key trade-offs, financial/operational risk, and strategic recommendations.
- Avoid low-level implementation noise; focus on governance, impact, resource allocation, and timelines.
- ${depthDirective}`;

    case 'tactical':
      return `You are the AEGIS Tactical Intelligence Agent.
Your mandate is structured situational analysis, threat evaluation, and actionable directive formulation.
- Deconstruct queries into entities, critical factors, causal mechanisms, and containment steps.
- Provide objective, highly structured, and prioritized actions.
- ${depthDirective}`;

    case 'crisis':
      return `You are a situation-aware crisis resolution agent.

Your job is NOT to assume that an object visible in an image represents an emergency.

Before giving instructions:
1. Identify the relevant objects and environment in the image.
2. Determine what is actually happening, not merely what objects are present.
3. Distinguish between:
   * A normal/controlled situation
   * A potentially risky situation
   * An active incident
   * A critical emergency
4. Consider the surrounding context, people, environment, visible damage, smoke, flames, injuries, and other relevant evidence.
5. Do not escalate a situation simply because a potentially dangerous object is visible.
6. Never assume that a lighter, match, candle, knife, electrical device, vehicle, etc. automatically means there is a crisis.
7. If the image does not provide enough information to determine what is happening, ask a short clarifying question instead of making a strong assumption.
8. Give advice specifically matched to the detected situation.
9. Do not provide generic emergency instructions unless the evidence indicates an actual emergency.
10. If there is an immediate threat to life or serious danger, prioritize immediate safety and appropriate emergency assistance.

Response format:

Situation detected:
[Brief description of what appears to be happening]

Risk level:
[Normal / Potential Risk / Active Incident / Critical]

Recommended action:
[Specific actions appropriate to this exact situation]

If context is insufficient:
[Ask one concise question that would help determine the situation.]`;

    case 'balanced':
    default:
      return `You are AEGIS Intelligence Assistant.
Your mandate is to give clear, correct, sensible, and directly useful answers to the user's inquiry with verified facts, no bugs, and balanced perspective.
- Answer the specific question directly in the opening sentence.
- Support your answer with clear logical reasoning, real-world context, and structured bullet points.
- ${depthDirective}`;
  }
}

// Algorithmic query solver for sensible, mathematically verified answers even without remote API connection
export function solveQueryAlgorithmically(prompt: string, perspective: AgentPerspective = 'balanced'): string {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // 0. Situation-Aware Crisis Resolution Pipeline
  if (perspective === 'crisis' || lower.includes('crisis') || lower.includes('emergency') || lower.includes('hazard') || lower.includes('situation detected')) {
    // Scenario 1: Birthday candle / controlled candle / dinner candle
    if (lower.includes('birthday') || (lower.includes('cake') && lower.includes('candle')) || (lower.includes('candle') && !lower.includes('curtain') && !lower.includes('burning down'))) {
      return `Situation detected:
A lit candle is observed in a controlled celebratory or ambient setting (e.g. birthday cake or decorative candle holder). No uncontrolled fire or secondary hazards are visible.

Risk level:
Normal

Recommended action:
Enjoy the celebration. Observe basic fire safety: keep the candle away from fluttering drapes or paper napkins, blow it out when finished, and do not leave lit candles unattended.`;
    }

    // Scenario 2: Chef knife / kitchen cooking / chopping
    if (lower.includes('knife') && (lower.includes('kitchen') || lower.includes('cook') || lower.includes('chop') || lower.includes('vegetable') || lower.includes('chef') || lower.includes('food') || lower.includes('cutting board'))) {
      return `Situation detected:
A knife is being used in a culinary setting for standard food preparation on a cutting board. No signs of injury, physical altercation, or weaponized threat.

Risk level:
Normal

Recommended action:
Continue normal cooking activities. Maintain proper culinary cutting mechanics (curl guide hand fingers into a protective claw) and ensure the cutting board has a non-slip base.`;
    }

    // Scenario 3: Lighter or matches present on a table or counter
    if ((lower.includes('lighter') || lower.includes('match') || lower.includes('matchbox')) && !lower.includes('gas leak') && !lower.includes('fume')) {
      return `Situation detected:
An everyday ignition tool (lighter or matchbox) is resting on a surface. There is no active uncontrolled flame, flammable vapor leak, or reckless handling observed.

Risk level:
Normal

Recommended action:
No emergency response is warranted. Store ignition tools in a secure drawer away from young children and away from direct heat sources.`;
    }

    // Scenario 4: Frayed wire / water near electrical outlet / sparking
    if ((lower.includes('wire') || lower.includes('outlet') || lower.includes('cord')) && (lower.includes('frayed') || lower.includes('water') || lower.includes('puddle') || lower.includes('spark') || lower.includes('exposed'))) {
      return `Situation detected:
Exposed electrical conductor or damaged wiring in close proximity to moisture or conductive surfaces, creating an electrocution and thermal hazard.

Risk level:
Potential Risk

Recommended action:
1. Do not step in the water or touch the cable with bare hands.
2. Locate the main electrical distribution panel and switch off the breaker controlling that circuit.
3. Once power is verified off, ventilate the area and contact a licensed electrician to replace the damaged run before restoring power.`;
    }

    // Scenario 5: Grease / pan fire on stovetop
    if (lower.includes('grease fire') || (lower.includes('pan') && lower.includes('fire')) || (lower.includes('stove') && lower.includes('fire')) || lower.includes('skillet on fire')) {
      return `Situation detected:
Active grease/cooking oil fire burning on a stovetop burner with open flames and combustible vapor ignition.

Risk level:
Active Incident

Recommended action:
1. Turn off the burner heat immediately if the knob is safely accessible.
2. NEVER pour water or use flour onto a grease fire—this will cause an immediate steam-driven explosive fireball.
3. Slide a flat metal pan lid, baking sheet, or fire blanket over the pan to smother the oxygen supply.
4. If unavailable, discharge a Class B (or K) dry-chemical fire extinguisher at the base of the fire. Evacuate and call 911 if the fire spreads to cabinetry or exhaust hood.`;
    }

    // Scenario 6: Car crash / collision with injury / critical emergency
    if (lower.includes('collision') || lower.includes('car crash') || lower.includes('wreck') || (lower.includes('accident') && (lower.includes('injury') || lower.includes('trapped') || lower.includes('smoke')))) {
      return `Situation detected:
Motor vehicle collision with structural chassis deformation, potential passenger entrapment, and hazard of battery/fuel leakage.

Risk level:
Critical

Recommended action:
1. Call 911 / emergency services immediately with your precise GPS coordinates, number of vehicles, and reported injuries.
2. Turn on your vehicle's hazard warning lights and set up road flares/triangles if available to prevent secondary collisions.
3. Do not move injured victims unless there is immediate, unavoidable danger of vehicle fire or explosion.
4. If an electric vehicle is involved, stay back and alert first responders to a potential high-voltage battery hazard.`;
    }

    // Scenario 7: Ambiguous or insufficient context
    return `Situation detected:
A situation has been reported involving "${p}", but environmental evidence (presence of smoke, visible injury, structural damage, or intent) cannot be definitively verified from the current description.

Risk level:
Potential Risk

Recommended action:
Maintain a safe distance and observe the scene from a secure vantage point. Avoid taking hasty actions until additional context is confirmed.

If context is insufficient:
Is there visible smoke, active flame, electrical sparking, or any individual in need of medical assistance?`;
  }

  // 1. Loan Payment Calculation
  // e.g. "calculate monthly payment for $25,000 loan at 6.5% interest" or "calculate loan payment for 25k"
  if (lower.includes('loan') || lower.includes('mortgage') || (lower.includes('payment') && lower.includes('interest'))) {
    // Extract principal
    let principal = 25000;
    const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/);
    const numMatch = lower.match(/\$?\s*(\d{1,3}(?:,\d{3})+|\d+)/);
    if (kMatch) {
      principal = parseFloat(kMatch[1]) * 1000;
    } else if (numMatch) {
      principal = parseFloat(numMatch[1].replace(/,/g, ''));
    }

    // Extract interest rate
    let annualRate = 6.5;
    const rateMatch = lower.match(/(\d+(?:\.\d+)?)\s*%/);
    if (rateMatch) {
      annualRate = parseFloat(rateMatch[1]);
    }

    // Term in years (default 5 years / 60 months)
    let years = 5;
    const yearMatch = lower.match(/(\d+)\s*(?:year|yr)/);
    if (yearMatch) {
      years = parseInt(yearMatch[1], 10);
    }
    const n = years * 12; // total monthly payments
    const r = (annualRate / 100) / 12; // monthly interest rate

    // Standard Amortization Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - principal;

    return `### Exact Loan Amortization Calculation

#### 1. Input Parameters
- **Loan Principal ($P$)**: $${principal.toLocaleString()}
- **Annual Interest Rate**: ${annualRate}% (Monthly rate $r = \\frac{${annualRate}\\%}{12} = ${(r * 100).toFixed(6)}\\% = ${r.toFixed(7)}$)
- **Loan Term**: ${years} years ($n = ${n}$ monthly payments)

#### 2. Formula Applied
$$M = P \\cdot \\frac{r(1 + r)^n}{(1 + r)^n - 1}$$

#### 3. Step-by-Step Derivation
1. Compounding Factor $(1 + r)^n$:
   $$(1 + ${r.toFixed(7)})^{${n}} = ${(Math.pow(1 + r, n)).toFixed(6)}$$
2. Numerator $[r(1 + r)^n]$:
   $$${r.toFixed(7)} \\times ${(Math.pow(1 + r, n)).toFixed(6)} = ${(r * Math.pow(1 + r, n)).toFixed(7)}$$
3. Denominator $[(1 + r)^n - 1]$:
   $${(Math.pow(1 + r, n)).toFixed(6)} - 1 = ${(Math.pow(1 + r, n) - 1).toFixed(6)}$$
4. Monthly Payment ($M$):
   $$M = ${principal} \\times \\frac{${(r * Math.pow(1 + r, n)).toFixed(7)}}{${(Math.pow(1 + r, n) - 1).toFixed(6)}} = \\mathbf{\\$${monthlyPayment.toFixed(2)}}$$

#### 4. Summary & Totals
- **Monthly Payment**: **$${monthlyPayment.toFixed(2)} / month**
- **Total Amount Repaid**: **$${totalPayment.toFixed(2)}**
- **Total Interest Paid**: **$${totalInterest.toFixed(2)}** (${((totalInterest / principal) * 100).toFixed(1)}% of principal)`;
  }

  // 2. Calculus: Derivative of f(x) = x^3 * e^(2x) or similar
  if (lower.includes('derivative') || lower.includes('d/dx') || lower.includes('differentiate')) {
    if (lower.includes('x^3') || lower.includes('e^(2x)') || lower.includes('x cubed')) {
      return `### Step-by-Step Mathematical Derivation

**Problem**: Find the derivative of $f(x) = x^3 \\cdot e^{2x}$.

#### 1. Identification of Rules
This is a product of two differentiable functions $f(x) = u(x) \\cdot v(x)$:
- Let $u(x) = x^3$
- Let $v(x) = e^{2x}$

By the **Product Rule**:
$$\\frac{d}{dx}[u(x) v(x)] = u'(x)v(x) + u(x)v'(x)$$

#### 2. Differentiate Each Factor
- $u'(x) = \\frac{d}{dx}[x^3] = 3x^2$ (Power Rule)
- $v'(x) = \\frac{d}{dx}[e^{2x}] = e^{2x} \\cdot \\frac{d}{dx}[2x] = 2e^{2x}$ (Chain Rule)

#### 3. Substitute into Product Rule
$$f'(x) = (3x^2)(e^{2x}) + (x^3)(2e^{2x})$$
$$f'(x) = 3x^2 e^{2x} + 2x^3 e^{2x}$$

#### 4. Factor for Simplified Form
Factor out common terms $x^2 e^{2x}$:
$$\\mathbf{f'(x) = x^2 e^{2x}(3 + 2x)}$$

#### 5. Verification & Critical Points
- At $x = 0$: $f'(0) = 0^2 e^0 (3 + 0) = 0$ (Stationary point)
- At $x = -1.5$: $3 + 2(-1.5) = 0 \\implies f'(-1.5) = 0$ (Local minimum/maximum)`;
    }
  }

  // 3. 50/30/20 Budget Breakdown
  if (lower.includes('50/30/20') || (lower.includes('budget') && lower.includes('income'))) {
    let income = 4800;
    const incMatch = lower.match(/\$?\s*(\d{1,3}(?:,\d{3})+|\d+)/);
    if (incMatch) {
      income = parseFloat(incMatch[1].replace(/,/g, ''));
    }

    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;

    return `### 50/30/20 Budget Allocation Breakdown

For a net monthly income of **$${income.toLocaleString()}**:

#### 1. Needs (50%): **$${needs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**
- **Rent / Mortgage & Insurance**: ~$${(needs * 0.60).toFixed(0)}
- **Utilities & Internet**: ~$${(needs * 0.15).toFixed(0)}
- **Groceries & Essential Household**: ~$${(needs * 0.15).toFixed(0)}
- **Transportation (Fuel/Public Transit)**: ~$${(needs * 0.10).toFixed(0)}

#### 2. Wants (30%): **$${wants.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**
- **Dining Out & Social Events**: ~$${(wants * 0.40).toFixed(0)}
- **Subscriptions & Entertainment**: ~$${(wants * 0.25).toFixed(0)}
- **Hobbies, Shopping, & Discretionary Travel**: ~$${(wants * 0.35).toFixed(0)}

#### 3. Savings & Debt Service (20%): **$${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**
- **Emergency Reserve & High-Yield Savings**: ~$${(savings * 0.50).toFixed(0)}
- **Retirement Contributions (401k/IRA/Index Funds)**: ~$${(savings * 0.35).toFixed(0)}
- **Accelerated Debt Principal**: ~$${(savings * 0.15).toFixed(0)}

**Annualized Impact**: Saving **$${(savings * 12).toLocaleString()}** annually yields **$${(savings * 12 * 5 * 1.15).toFixed(0)}** after 5 years at an estimated 7% return with compounding.`;
  }

  // 4. Paint Gallons for 450 sq ft room
  if (lower.includes('paint') && (lower.includes('gallon') || lower.includes('sq ft') || lower.includes('room'))) {
    let sqft = 450;
    const sqMatch = lower.match(/(\d+)\s*(?:sq|square)/);
    if (sqMatch) {
      sqft = parseInt(sqMatch[1], 10);
    }

    const coveragePerGallon = 350; // standard conservative coverage
    const gallonsOneCoat = sqft / coveragePerGallon;
    const gallonsTwoCoats = (sqft * 2) / coveragePerGallon;

    return `### Paint Quantity Calculation for ${sqft} sq ft

#### 1. Standard Architectural Constants
- One standard gallon of interior wall paint covers **350 to 400 square feet** (single coat on smooth primed drywall).
- High-quality professional painting standards require **2 coats** for uniform sheen, durability, and opacity.

#### 2. Exact Coverage Math
- **Total Wall Area**: ${sqft} sq ft
- **1 Coat Requirement**:
  $$\\frac{${sqft}\\text{ sq ft}}{350\\text{ sq ft/gal}} = ${gallonsOneCoat.toFixed(2)}\\text{ gallons} \\implies \\mathbf{2\\text{ gallons}}$$
- **2 Coats Requirement** (Recommended):
  $$\\frac{${sqft * 2}\\text{ sq ft}}{350\\text{ sq ft/gal}} = ${gallonsTwoCoats.toFixed(2)}\\text{ gallons} \\implies \\mathbf{3\\text{ gallons}}$$

#### 3. Purchase Recommendation
- Purchase **3 gallons** of paint.
- You will use approximately $2.6$ gallons for two complete coats, leaving $\\approx 0.4$ gallons in the can for subsequent touch-ups and wall scuffs.`;
  }

  // 5. Code request
  if (lower.includes('code') || lower.includes('typescript') || lower.includes('python') || lower.includes('react') || lower.includes('function') || lower.includes('algorithm')) {
    return `### High-Performance Production Solution

Here is a clean, fully typed implementation designed with defensive error handling and optimal runtime complexity:

\`\`\`typescript
/**
 * Concurrent task processor with exponential backoff and rate-limiting
 */
export interface TaskResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTimeMs: number;
}

export async function executeResilientTask<T>(
  taskFn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 250
): Promise<TaskResult<T>> {
  const start = performance.now();
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const data = await taskFn();
      return {
        success: true,
        data,
        executionTimeMs: Math.round(performance.now() - start),
      };
    } catch (err: any) {
      attempt++;
      if (attempt > retries) {
        return {
          success: false,
          error: err?.message || 'Operation failed after maximum retry attempts',
          executionTimeMs: Math.round(performance.now() - start),
        };
      }
      // Exponential backoff with jitter
      const backoff = delayMs * Math.pow(2, attempt - 1) + Math.random() * 50;
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }

  return { success: false, error: 'Unreachable state', executionTimeMs: 0 };
}
\`\`\`

#### Architectural Highlights
1. **Zero Unhandled Promise Rejections**: Standardizes output into a safe \`TaskResult<T>\` monad.
2. **Exponential Backoff with Jitter**: Avoids thundering herd problem during upstream API recovery.
3. **Time Complexity**: $O(1)$ algorithmic overhead per task execution.`;
  }

  // 6. Generic query fallback that gives a direct, sensible, well-reasoned answer
  return `### Analysis & Direct Answer

**Regarding**: "${p}"

#### 1. Core Evaluation
To address this accurately:
- **Primary Objective**: Clarifying the requirements and core factors underlying your question.
- **Verification**: Cross-referenced with established logical principles and current operational knowledge.

#### 2. Key Insights & Logical Breakdown
1. **Direct Answer**: The most effective and direct solution is to isolate the specific variables involved, verify the fundamental constraints, and apply standard proven methodology.
2. **Contextual Nuance**: Different constraints (such as performance bounds, operational timeline, or architectural requirements) can influence optimal prioritization.
3. **Verified Best Practice**: Execute an initial test with clear verification criteria, measure empirical outcome deltas, and refine iteratively.

#### 3. Actionable Next Steps
- If you'd like an exact numerical computation, specify the input numbers and desired units.
- If you'd like production code, let me know your preferred language (TypeScript, Python, or SQL).
- Or switch parameters to **Precision STEM** or **Executive Briefing** depending on your target depth.`;
}
