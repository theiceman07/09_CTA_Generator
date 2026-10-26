import { GenerationInput, ProductionPlan, Scene, Shot, PropItem, BRollItem } from '../types';

/**
 * Master 6-Scene Sample Data: "My Morning Routine" (YouTube Shorts, 60s, Energetic)
 */
export const SAMPLE_MORNING_ROUTINE_SCRIPT = 
  "Every morning gives us another chance to start fresh. I wake up, make my bed, open the curtains and take a few minutes to plan my day. Then I grab my coffee, pack my bag and get ready to leave. It may look like a simple routine, but these small habits help me stay focused and productive throughout the day.";

export const SAMPLE_MORNING_ROUTINE_PLAN: ProductionPlan = {
  id: 'plan-sample-morning-routine',
  projectId: 'proj-sample-morning-routine',
  summary: {
    totalDuration: '60 sec',
    totalDurationSeconds: 60,
    sceneCount: 6,
    shotCount: 18,
    propCount: 7,
    brollCount: 10,
  },
  scenes: [
    {
      id: 'sc-1',
      sceneNumber: 1,
      title: 'Morning Wake-Up & Awakening',
      duration: '8 sec',
      durationSeconds: 8,
      location: 'Bedroom',
      purpose: 'Establish the morning atmosphere and hook the viewer instantly with relatable wake-up momentum.',
      dialogue: '"Every morning starts with one simple decision..."',
      visualDescription: 'Creator wakes up, taps the alarm clock off, sits up on the edge of the bed, opens the sheer curtains, and looks out into the early dawn sunlight.',
      cameraDirectionSummary: 'Start with an intimate close-up of the alarm clock. Slowly pan toward creator. Quick whip-pan cut to medium shot as curtains fly open.',
      cameraDetails: {
        shotType: 'Close-up → Medium shot',
        cameraMovement: 'Slow pan left to quick push-in',
        cameraAngle: 'Eye level (slightly low at bedside)',
        framing: 'Subject centered with window backlight',
        lensSuggestion: '35mm f/1.8 prime',
        movementSpeed: 'Slow building to snappy cut',
        composition: 'Rule of thirds with window framing',
      },
      shotType: 'Close-up → Medium shot',
      lighting: 'Soft blue-tinted dawn light transitioning into warm morning sunlight.',
      props: ['Alarm clock', 'Bed with neutral linen', 'Sheer curtains', 'Smartphone'],
      broll: [
        'Macro of alarm clock numbers ticking to 06:30 AM',
        'Warm sunlight spilling across wooden floorboards',
        'Hand smoothly drawing sheer linen curtains open',
      ],
      audio: 'Soft chime alarm sound fade-out into gentle ambient loft music + crisp voice-over.',
      shots: [
        {
          id: 'shot-01',
          shotNumber: 1,
          sceneNumber: 1,
          shotType: 'Extreme Close-up',
          cameraMovement: 'Static with shallow depth of field',
          cameraAngle: 'Eye level',
          framing: 'Alarm clock centered',
          lensSuggestion: '50mm macro',
          movementSpeed: 'Static',
          composition: 'Centered subject',
          subject: 'Alarm clock display & snooze hand tap',
          duration: '2 sec',
          durationSeconds: 2,
          audio: 'Gentle digital chime alarm cut short by click',
          description: 'Focus on digital numbers 06:30, finger presses snooze button firmly.',
        },
        {
          id: 'shot-02',
          shotNumber: 2,
          sceneNumber: 1,
          shotType: 'Medium Shot',
          cameraMovement: 'Slow pan tracking subject',
          cameraAngle: 'Slight low angle from bedside table',
          framing: 'Creator sitting up in bed',
          lensSuggestion: '35mm prime',
          movementSpeed: 'Slow & natural',
          composition: 'Golden ratio',
          subject: 'Creator stretching and taking deep breath',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'VO: "Every morning starts with one simple decision..."',
          description: 'Creator swings legs over the bed side, stretch and centered focus.',
        },
        {
          id: 'shot-03',
          shotNumber: 3,
          sceneNumber: 1,
          shotType: 'Wide to Medium Push-in',
          cameraMovement: 'Push-in toward bedroom window',
          cameraAngle: 'Eye level',
          framing: 'Silhouette opening curtains revealing bright horizon',
          lensSuggestion: '24mm wide angle',
          movementSpeed: 'Snappy fluid push',
          composition: 'Leading lines through window frame',
          subject: 'Bedroom space & morning horizon',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Curtain fabric rustle + upbeat lo-fi instrumental drop',
          description: 'Hands pull curtains; golden morning flare hits camera lens cleanly.',
        },
      ],
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      title: 'Making the Bed & Space Reset',
      duration: '7 sec',
      durationSeconds: 7,
      location: 'Bedroom',
      purpose: 'Demonstrate quick micro-habit discipline that establishes visual clarity for the viewer.',
      dialogue: '"Small disciplines build monumental days."',
      visualDescription: 'Time-ramped sequence of pulling duvet tight, tucking sheet corners, and placing decorative pillows with satisfying precision.',
      cameraDirectionSummary: 'High-angle wide shot looking down at the bed, followed by low tabletop close-up smoothing out wrinkles.',
      cameraDetails: {
        shotType: 'High Angle → Close-up',
        cameraMovement: 'Static overhead to diagonal tilt',
        cameraAngle: 'Bird’s-eye 45-degree angle',
        framing: 'Bed filling bottom two-thirds of frame',
        lensSuggestion: '28mm wide',
        movementSpeed: 'Time-ramped fast to slow',
        composition: 'Symmetrical alignment',
      },
      shotType: 'High Angle → Close-up',
      lighting: 'Bright diffused morning daylight from side window.',
      props: ['Duvet', 'Fitted sheets', 'Minimalist throw pillows'],
      broll: [
        'Close-up of hand smoothing out wrinkles in white duvet',
        'Pillow chop in satisfying 60fps slow motion',
      ],
      audio: 'Crisp sheet snap foley, soft bed tucking sounds, upbeat rhythmic beat.',
      shots: [
        {
          id: 'shot-04',
          shotNumber: 4,
          sceneNumber: 2,
          shotType: 'High Angle Wide',
          cameraMovement: 'Static overhead locked off',
          cameraAngle: '45-degree downward angle',
          framing: 'Full bed centered in frame',
          lensSuggestion: '24mm',
          movementSpeed: 'Static with 1.5x speed ramp',
          composition: 'Geometric symmetry',
          subject: 'Creator smoothing linen duvet',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Rhythmic fabric swoosh foley',
          description: 'Quick fluid motion pulling duvet up and aligning pillows effortlessly.',
        },
        {
          id: 'shot-05',
          shotNumber: 5,
          sceneNumber: 2,
          shotType: 'Close-up Detail',
          cameraMovement: 'Tracking glide along bed edge',
          cameraAngle: 'Low angle tabletop',
          framing: 'Hand smoothing fabric texture',
          lensSuggestion: '50mm f/2.0',
          movementSpeed: 'Smooth glide',
          composition: 'Diagonal leading line',
          subject: 'Hand smoothing linen sheets',
          duration: '2 sec',
          durationSeconds: 2,
          audio: 'VO: "Small habits..."',
          description: 'Crisp texture focus showing clean aesthetic morning minimalism.',
        },
        {
          id: 'shot-06',
          shotNumber: 6,
          sceneNumber: 2,
          shotType: 'Medium Overview',
          cameraMovement: 'Subtle tilt up from made bed to creator walking past',
          cameraAngle: 'Eye level',
          framing: 'Tidy room with creator in background',
          lensSuggestion: '35mm',
          movementSpeed: 'Fluid slow tilt',
          composition: 'Depth of field separation',
          subject: 'Clean made bed in foreground, creator stepping toward desk',
          duration: '2 sec',
          durationSeconds: 2,
          audio: 'Floorboard footsteps + gentle bassline',
          description: 'Creator walks cleanly out of frame toward workstation.',
        },
      ],
    },
    {
      id: 'sc-3',
      sceneNumber: 3,
      title: 'Daily Planning & Mindful Journaling',
      duration: '12 sec',
      durationSeconds: 12,
      location: 'Minimalist Desk Workspace',
      purpose: 'Show the cognitive foundation of the day — intention setting and prioritizing top 3 tasks.',
      dialogue: '"Before the noise of emails and notifications, I claim ten minutes just for clarity."',
      visualDescription: 'Creator sits at a clean wooden desk, opens a leather-bound notebook, writes down key priorities with a fountain pen, glancing at a minimalist calendar.',
      cameraDirectionSummary: 'Over-the-shoulder medium shot cutting to a 90-degree top-down flat lay of the journal and pen.',
      cameraDetails: {
        shotType: 'Over-the-shoulder → Top-down Flat Lay',
        cameraMovement: 'Gentle slow push-in over shoulder',
        cameraAngle: 'Over-the-shoulder (30-degree tilt) then 90-degree overhead',
        framing: 'Notebook on right third, pen in hand',
        lensSuggestion: '50mm prime f/1.8',
        movementSpeed: 'Very steady and contemplative',
        composition: 'Rule of thirds with clean desk negative space',
      },
      shotType: 'Over-the-shoulder → Macro Flat Lay',
      lighting: 'Warm key light at 45 degrees, soft window fill from camera left.',
      props: ['Leather daily planner', 'Matte black fountain pen', 'Desk plant (monstera)', 'Minimalist desk pad'],
      broll: [
        'Macro shot of fountain pen nib gliding on textured paper',
        'Close-up of crossing off previous day’s review item',
      ],
      audio: 'Crisp paper rustle, fountain pen scratching ASMR, contemplative VO.',
      shots: [
        {
          id: 'shot-07',
          shotNumber: 7,
          sceneNumber: 3,
          shotType: 'Over-the-shoulder Medium',
          cameraMovement: 'Slow steady push-in',
          cameraAngle: 'Over right shoulder',
          framing: 'Creator profile in frame edge, desk in focus',
          lensSuggestion: '35mm',
          movementSpeed: 'Slow push',
          composition: 'Over-the-shoulder framing',
          subject: 'Creator sitting down and opening planner',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'VO: "Before the noise of notifications..."',
          description: 'Smooth sit-down motion, setting notebook down deliberately.',
        },
        {
          id: 'shot-08',
          shotNumber: 8,
          sceneNumber: 3,
          shotType: 'Macro Overhead Flat Lay',
          cameraMovement: 'Static top-down',
          cameraAngle: '90-degree straight down',
          framing: 'Journal page filling 80% frame',
          lensSuggestion: '50mm macro',
          movementSpeed: 'Static',
          composition: 'Flat lay geometry',
          subject: 'Fountain pen ink drying on paper',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'Scratchy pen on paper ASMR sound',
          description: 'Writing "Focus: Finish Script & Film" in clean typography.',
        },
        {
          id: 'shot-09',
          shotNumber: 9,
          sceneNumber: 3,
          shotType: 'Close-up Face & Expression',
          cameraMovement: 'Slow micro-pan across eyes',
          cameraAngle: 'Eye level slightly profile',
          framing: 'Tight portrait crop',
          lensSuggestion: '85mm f/1.8',
          movementSpeed: 'Deliberate micro-move',
          composition: 'Leading eye line',
          subject: 'Creator expression of calm determination',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'VO: "...I claim ten minutes for clarity."',
          description: 'Creator nods, closes notebook with a crisp tap, ready to conquer the day.',
        },
      ],
    },
    {
      id: 'sc-4',
      sceneNumber: 4,
      title: 'Coffee Ritual & Sensory Pause',
      duration: '11 sec',
      durationSeconds: 11,
      location: 'Kitchen / Coffee Bar',
      purpose: 'Provide a dynamic sensory beat with warm aesthetics, steam, and rich audio cues.',
      dialogue: '"Then comes the ritual: dark roast, quiet steam, and five sips of total presence."',
      visualDescription: 'Creator pours hot water over a glass pour-over dripper. Steam curls up into the morning light beam. Pours coffee into a textured ceramic mug and takes first sip.',
      cameraDirectionSummary: 'Low angle counter tracking shot as kettle pours hot water, cutting into a shallow macro of coffee blooming, ending with a warm profile sip.',
      cameraDetails: {
        shotType: 'Low-angle Tracking → Extreme Close-up',
        cameraMovement: 'Smooth lateral dolly right tracking water stream',
        cameraAngle: 'Counter level looking slightly up',
        framing: 'Gooseneck kettle spout and dripper centered',
        lensSuggestion: '50mm f/1.4 for deep bokeh',
        movementSpeed: 'Slow cinematic glide',
        composition: 'Golden spiral centered on coffee drip',
      },
      shotType: 'Low-angle Counter → Macro Detail',
      lighting: 'Atmospheric rim lighting catching rising steam in back-lit beam.',
      props: ['Gooseneck kettle', 'Glass pour-over carafe', 'Textured stoneware ceramic mug', 'Coffee beans in jar'],
      broll: [
        'Water spiraling over freshly ground coffee bed (bloom)',
        'Steam swirling through a shaft of golden sunlight',
        'Rich amber coffee pouring into white/grey ceramic mug',
      ],
      audio: 'Water kettle pour, bubbly coffee drip, ceramic clink, inhale sip, uplifting melodic synth chime.',
      shots: [
        {
          id: 'shot-10',
          shotNumber: 10,
          sceneNumber: 4,
          shotType: 'Close-up Detail',
          cameraMovement: 'Slow tracking orbit',
          cameraAngle: '45-degree angle',
          framing: 'Pour-over cone with blooming grounds',
          lensSuggestion: '50mm macro',
          movementSpeed: 'Silky smooth orbit',
          composition: 'Center weighted',
          subject: 'Hot water stream hitting coffee grounds',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'Hissing kettle steam & rich bubbling sound',
          description: 'Steam curls elegantly upward into the sunlight.',
        },
        {
          id: 'shot-11',
          shotNumber: 11,
          sceneNumber: 4,
          shotType: 'Medium Close-up',
          cameraMovement: 'Static tripod shot',
          cameraAngle: 'Counter level',
          framing: 'Coffee carafe pouring into mug',
          lensSuggestion: '35mm',
          movementSpeed: 'Static',
          composition: 'Rule of thirds right',
          subject: 'Amber coffee filling ceramic mug',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Liquid pour splash + VO: "Then comes the ritual..."',
          description: 'Liquid fills mug to brim; rich crema forms on surface.',
        },
        {
          id: 'shot-12',
          shotNumber: 4,
          sceneNumber: 4,
          shotType: 'Medium Profile',
          cameraMovement: 'Slow subtle push-in',
          cameraAngle: 'Eye level profile',
          framing: 'Creator by kitchen window taking first sip',
          lensSuggestion: '50mm f/1.8',
          movementSpeed: 'Slow push',
          composition: 'Framed against morning window',
          subject: 'Creator holding warm mug with both hands',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'Contented exhale + acoustic guitar chord',
          description: 'Creator looks out window, refreshed and energised.',
        },
      ],
    },
    {
      id: 'sc-5',
      sceneNumber: 5,
      title: 'Everyday Carry Packing & Gear Check',
      duration: '12 sec',
      durationSeconds: 12,
      location: 'Entryway / Hallway Console Table',
      purpose: 'Fast-paced transition from home tranquility to action-ready outside world.',
      dialogue: '"Laptop, headphones, notebook, and focus. Packed and locked."',
      visualDescription: 'Rhythmic, high-energy packing montage: laptop slides into sleeve, headphones snap into case, water bottle drops into backpack side pocket, zipper pulls shut.',
      cameraDirectionSummary: 'Snappy whip-pans and whip-cuts between top-down EDC items entering the canvas backpack with fast kinetic transitions.',
      cameraDetails: {
        shotType: 'Quick Cuts → Top-Down EDC',
        cameraMovement: 'Quick snap zooms and micro whip-pans',
        cameraAngle: 'Top-down 75 degrees and 45-degree angle',
        framing: 'Backpack main compartment open in center',
        lensSuggestion: '28mm f/2.8',
        movementSpeed: 'Fast kinetic energy (Shorts style)',
        composition: 'Dynamic asymmetry',
      },
      shotType: 'Top-Down EDC → Rapid Cuts',
      lighting: 'Clean high-key hallway lighting with warm overhead sconce.',
      props: ['Everyday carry backpack', 'Laptop in leather sleeve', 'Over-ear headphones', 'Insulated water bottle', 'Car / house keys'],
      broll: [
        'Zipping rugged backpack zipper in rapid tight close-up',
        'Stainless steel water bottle clicking into elastic pouch',
        'Headphones collapsing into hard case',
      ],
      audio: 'Snappy zipper pull, magnetic clasp snap, bottle clink, fast percussive drum groove.',
      shots: [
        {
          id: 'shot-13',
          shotNumber: 13,
          sceneNumber: 5,
          shotType: 'Tight Close-up',
          cameraMovement: 'Whip-pan down into bag',
          cameraAngle: '60-degree tilt',
          framing: 'Laptop sleeve entering backpack',
          lensSuggestion: '35mm',
          movementSpeed: 'Quick whip',
          composition: 'Diagonal insert',
          subject: 'Laptop sliding into padded compartment',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Velcro snap foley',
          description: 'Smooth deliberate drop into backpack.',
        },
        {
          id: 'shot-14',
          shotNumber: 14,
          sceneNumber: 5,
          shotType: 'Macro Detail',
          cameraMovement: 'Tracking along zipper tooth track',
          cameraAngle: 'Side macro',
          framing: 'Zipper pull closing across frame',
          lensSuggestion: '50mm macro',
          movementSpeed: 'Brisk linear pull',
          composition: 'Horizontal line',
          subject: 'Backpack zipper pulled tightly shut',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'Crisp metallic zipper zip + VO: "Packed and locked."',
          description: 'Hand pulls zipper across with finality.',
        },
        {
          id: 'shot-15',
          shotNumber: 15,
          sceneNumber: 5,
          shotType: 'Medium Action Shot',
          cameraMovement: 'Low angle tilt-up tracking backpack lift',
          cameraAngle: 'Low angle',
          framing: 'Creator slinging backpack over one shoulder',
          lensSuggestion: '24mm wide',
          movementSpeed: 'Energetic upward swing',
          composition: 'Hero power angle',
          subject: 'Creator hoisting backpack with confident posture',
          duration: '5 sec',
          durationSeconds: 5,
          audio: 'Backpack strap thud + energetic drum fill',
          description: 'Creator swings backpack onto shoulder and turns toward door.',
        },
      ],
    },
    {
      id: 'sc-6',
      sceneNumber: 6,
      title: 'Stepping Out & The World Awaits',
      duration: '10 sec',
      durationSeconds: 10,
      location: 'Front Door & City Morning Exterior',
      purpose: 'Triumphant conclusion delivering the inspiring CTA and strong punchy finish.',
      dialogue: '"It may look like a simple routine, but these small habits win the day before it even starts. Go create."',
      visualDescription: 'Creator grabs brass keychain from wooden tray, turns the front door lock, pulls door open into radiant sunny morning street, steps outside into world.',
      cameraDirectionSummary: 'Low angle looking up as keys are scooped up, followed by a wide shot framed through the open doorway as creator strides into the morning sunshine.',
      cameraDetails: {
        shotType: 'Low-angle Grab → Wide Backlit Silhouette',
        cameraMovement: 'Tracking backward out the door with subject',
        cameraAngle: 'Low angle moving into eye-level exterior',
        framing: 'Doorway creating natural frame-within-a-frame',
        lensSuggestion: '24mm f/2.8 wide',
        movementSpeed: 'Dynamic forward momentum',
        composition: 'Frame within frame, central vanishing point',
      },
      shotType: 'Medium → Wide Outdoor Hero Shot',
      lighting: 'Interior ambient to brilliant outdoor natural morning sunlight flare.',
      props: ['Brass keychain with apartment key', 'Wooden entryway tray', 'White sneakers', 'Sunglasses (optional)'],
      broll: [
        'Close-up hand snatching keys off entryway catchall dish',
        'Deadbolt unlock click and brass door handle turn',
        'Sneakers stepping onto sunlit pavement outside',
      ],
      audio: 'Key jingle, metallic deadbolt turn, exterior city ambiance, swelling motivational music peak, crisp closing VO.',
      shots: [
        {
          id: 'shot-16',
          shotNumber: 16,
          sceneNumber: 6,
          shotType: 'Extreme Close-up',
          cameraMovement: 'Dynamic hand-held swoop',
          cameraAngle: 'High angle to catchall tray',
          framing: 'Hand entering frame to grab keys',
          lensSuggestion: '35mm',
          movementSpeed: 'Quick grab',
          composition: 'Thirds right',
          subject: 'Hand snatching keys from dish',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Key jingle chime + VO: "It may look like a simple routine..."',
          description: 'Key grab in one swift muscle memory gesture.',
        },
        {
          id: 'shot-17',
          shotNumber: 17,
          sceneNumber: 6,
          shotType: 'Close-up Action',
          cameraMovement: 'Static',
          cameraAngle: 'Eye level door handle',
          framing: 'Door lock & brass handle',
          lensSuggestion: '50mm',
          movementSpeed: 'Static',
          composition: 'Center aligned',
          subject: 'Deadbolt turning and door opening outward',
          duration: '3 sec',
          durationSeconds: 3,
          audio: 'Crisp mechanical deadbolt click & latch release',
          description: 'Sunlight rushes through the cracking door opening.',
        },
        {
          id: 'shot-18',
          shotNumber: 18,
          sceneNumber: 6,
          shotType: 'Wide Framing Exterior',
          cameraMovement: 'Tracking push-out into exterior street',
          cameraAngle: 'Eye level following creator back',
          framing: 'Subject walking away centered down street into sunlight',
          lensSuggestion: '24mm wide angle',
          movementSpeed: 'Steady tracking glide',
          composition: 'Symmetrical urban vanishing point',
          subject: 'Creator walking briskly into morning bustle',
          duration: '4 sec',
          durationSeconds: 4,
          audio: 'VO: "...these small habits win the day. Go create." + Music crescendo & cut.',
          description: 'Inspiring final hero visual with lens flare and fade out.',
        },
      ],
    },
  ],
  propsAndEquipment: [
    { id: 'pe-1', name: 'Digital alarm clock / Phone dock', category: 'Props', prepared: true, notes: 'Set display to 06:30 AM' },
    { id: 'pe-2', name: 'Minimalist neutral bed linen & pillows', category: 'Props', prepared: true, notes: 'Steam ironed for crisp textures' },
    { id: 'pe-3', name: 'Leather daily planner & fountain pen', category: 'Props', prepared: false, notes: 'Black ink, blank clean pages' },
    { id: 'pe-4', name: 'Gooseneck kettle & glass pour-over carafe', category: 'Props', prepared: true, notes: 'Polished stainless steel' },
    { id: 'pe-5', name: 'Textured stoneware ceramic coffee mug', category: 'Props', prepared: true, notes: 'Matte grey or beige ceramic' },
    { id: 'pe-6', name: 'Urban canvas everyday carry backpack', category: 'Props', prepared: false, notes: 'Clean compartments ready for insert' },
    { id: 'pe-7', name: 'Brass keychain with vintage tag', category: 'Props', prepared: false, notes: 'In entryway wooden catchall' },

    { id: 'pe-8', name: 'Primary Camera / 4K Smartphone (60fps)', category: 'Camera Equipment', prepared: true, notes: 'Clean lens, battery 100%' },
    { id: 'pe-9', name: 'Compact travel tripod with overhead arm', category: 'Camera Equipment', prepared: true, notes: 'For flat lay desk shots' },
    { id: 'pe-10', name: '3-Axis Smartphone / Mirrorless Gimbal', category: 'Camera Equipment', prepared: false, notes: 'Calibrated for tracking shots' },

    { id: 'pe-11', name: 'Bi-color LED panel with softbox diffuser', category: 'Lighting', prepared: true, notes: 'Key light 5600K balanced' },
    { id: 'pe-12', name: 'Reflector board (Silver / White)', category: 'Lighting', prepared: false, notes: 'Bounce morning window fill' },

    { id: 'pe-13', name: 'Wireless Lavalier Microphone with windscreen', category: 'Audio', prepared: true, notes: 'Connected to primary audio track' },
    { id: 'pe-14', name: 'Compact on-camera shotgun microphone', category: 'Audio', prepared: false, notes: 'For rich ambient foley' },
  ],
  brollClips: [
    {
      id: 'br-1',
      clipNumber: 1,
      visual: 'Macro of alarm clock numbers ticking to 06:30 AM',
      purpose: 'Add immediate urgency and morning context before face reveal.',
      suggestedDuration: '2 sec',
      suggestedDurationSeconds: 2,
      sceneNumber: 1,
      camera: 'Macro 50mm, shallow depth of field, static',
      audio: 'Soft digital chime fade',
    },
    {
      id: 'br-2',
      clipNumber: 2,
      visual: 'Warm golden sunlight spilling across bedroom floorboards',
      purpose: 'Establish aesthetic, peaceful morning ambiance.',
      suggestedDuration: '2 sec',
      suggestedDurationSeconds: 2,
      sceneNumber: 1,
      camera: 'Low floor level, slow tilt up, 35mm',
      audio: 'Lo-fi ambient background music',
    },
    {
      id: 'br-3',
      clipNumber: 3,
      visual: 'Hand smoothing out wrinkles in white linen duvet',
      purpose: 'Satisfying tactile ASMR beat communicating tidy habits.',
      suggestedDuration: '3 sec',
      suggestedDurationSeconds: 3,
      sceneNumber: 2,
      camera: '45-degree angle tracking hand movement',
      audio: 'Clean linen rustle foley',
    },
    {
      id: 'br-4',
      clipNumber: 4,
      visual: 'Decorative pillow karate-chop placement in slow motion (60fps)',
      purpose: 'Visual satisfaction and playful styling.',
      suggestedDuration: '2 sec',
      suggestedDurationSeconds: 2,
      sceneNumber: 2,
      camera: 'Eye-level bedside, 60fps slow ramp',
      audio: 'Soft pillow thud with beat drop',
    },
    {
      id: 'br-5',
      clipNumber: 5,
      visual: 'Macro shot of fountain pen nib ink gliding on creamy paper',
      purpose: 'Highlight intentional morning journaling and daily focus.',
      suggestedDuration: '3 sec',
      suggestedDurationSeconds: 3,
      sceneNumber: 3,
      camera: 'Top-down macro 90 degrees',
      audio: 'Pen scratching paper ASMR',
    },
    {
      id: 'br-6',
      clipNumber: 6,
      visual: 'Hot water spiraling over freshly ground coffee bed (pour-over bloom)',
      purpose: 'Sensory coffee ritual trigger beloved by YouTube audience.',
      suggestedDuration: '4 sec',
      suggestedDurationSeconds: 4,
      sceneNumber: 4,
      camera: 'Close-up 45-degree orbit with backlit steam',
      audio: 'Water bubbling and kettle hiss',
    },
    {
      id: 'br-7',
      clipNumber: 7,
      visual: 'Steam curling through a sunbeam in front of kitchen window',
      purpose: 'Cinematic mood booster between dialogue lines.',
      suggestedDuration: '3 sec',
      suggestedDurationSeconds: 3,
      sceneNumber: 4,
      camera: '50mm f/1.4 backlit, slow motion 60fps',
      audio: 'Gentle acoustic ambient pad',
    },
    {
      id: 'br-8',
      clipNumber: 8,
      visual: 'Rugged metal backpack zipper pulled shut in tight macro',
      purpose: 'Indicate completion of prep and shift toward active departure.',
      suggestedDuration: '2 sec',
      suggestedDurationSeconds: 2,
      sceneNumber: 5,
      camera: 'Macro tracking alongside zipper track',
      audio: 'Crisp high-frequency zip sound',
    },
    {
      id: 'br-9',
      clipNumber: 9,
      visual: 'Deadbolt unlocking and brass door handle turning',
      purpose: 'Physical cue of leaving the personal sanctuary into the world.',
      suggestedDuration: '2 sec',
      suggestedDurationSeconds: 2,
      sceneNumber: 6,
      camera: 'Tight framing on latch mechanism',
      audio: 'Heavy metallic latch click',
    },
    {
      id: 'br-10',
      clipNumber: 10,
      visual: 'Clean white sneakers stepping onto sunlit pavement outside',
      purpose: 'Punchy forward momentum closing the video on action.',
      suggestedDuration: '3 sec',
      suggestedDurationSeconds: 3,
      sceneNumber: 6,
      camera: 'Ground level tracking forward',
      audio: 'Footstep on concrete + upbeat outro cadence',
    },
  ],
  timeline: [
    { timestamp: '00:00', sceneNumber: 1, title: 'Wake-Up & Awakening', duration: '8 sec' },
    { timestamp: '00:08', sceneNumber: 2, title: 'Bed Reset & Space', duration: '7 sec' },
    { timestamp: '00:15', sceneNumber: 3, title: 'Daily Planning', duration: '12 sec' },
    { timestamp: '00:27', sceneNumber: 4, title: 'Coffee Ritual', duration: '11 sec' },
    { timestamp: '00:38', sceneNumber: 5, title: 'EDC Packing', duration: '12 sec' },
    { timestamp: '00:50', sceneNumber: 6, title: 'Stepping Out', duration: '10 sec' },
  ],
};

/**
 * Intelligent Mock AI Generation Service
 * Translates input parameters (script, duration, tone, platform, etc.)
 * into a full, structured Production Plan JSON.
 */
export async function generateProductionPlan(input: GenerationInput): Promise<ProductionPlan> {
  // If the user's script or title matches the morning routine demo, or is short, we provide the master crafted 6-scene plan tailored to their options
  const isMorningRoutine = 
    input.title.toLowerCase().includes('morning') || 
    input.script.toLowerCase().includes('morning') ||
    input.script.length < 80;

  if (isMorningRoutine && (!input.script || input.script.includes('fresh') || input.script.length < 80)) {
    // Clone and customize according to the user input
    return cloneAndCustomizePlan(SAMPLE_MORNING_ROUTINE_PLAN, input);
  }

  // Otherwise, intelligently segment the user's custom script into cohesive scenes!
  return buildCustomPlanFromScript(input);
}

function cloneAndCustomizePlan(basePlan: ProductionPlan, input: GenerationInput): ProductionPlan {
  const plan: ProductionPlan = JSON.parse(JSON.stringify(basePlan));
  plan.id = `plan-${Date.now()}`;
  plan.projectId = `proj-${Date.now()}`;
  plan.summary.totalDuration = input.targetDuration || '60 sec';

  // Customize tones/style across scenes
  const toneDesc = input.tones.join(', ') || 'Energetic';
  plan.scenes.forEach(scene => {
    scene.cameraDetails.movementSpeed = input.tones.includes('Cinematic') 
      ? 'Silky slow 24fps motion' 
      : input.tones.includes('Energetic') 
      ? 'Snappy quick pan' 
      : 'Natural and steady';
  });

  return plan;
}

/**
 * Parses any custom script into multiple scenes with generated shots, props, and b-roll.
 */
function buildCustomPlanFromScript(input: GenerationInput): ProductionPlan {
  const sentences = input.script
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Group sentences into 3 to 6 scenes
  const sceneCount = Math.max(3, Math.min(6, Math.ceil(sentences.length / 2)));
  const totalDurationSec = parseDurationToSeconds(input.targetDuration);
  const avgDurationPerScene = Math.max(5, Math.floor(totalDurationSec / sceneCount));

  const scenes: Scene[] = [];
  const propsList: PropItem[] = [];
  const brollList: BRollItem[] = [];
  let currentTimestampSeconds = 0;
  const timeline: { timestamp: string; sceneNumber: number; title: string; duration: string }[] = [];

  const sentencesPerScene = Math.max(1, Math.ceil(sentences.length / sceneCount));

  for (let i = 0; i < sceneCount; i++) {
    const sceneNum = i + 1;
    const sceneSentences = sentences.slice(i * sentencesPerScene, (i + 1) * sentencesPerScene);
    const sceneDialogue = sceneSentences.join(' ') || `Key action and takeaway for Scene ${sceneNum}.`;
    const sceneDurationSec = (i === sceneCount - 1) 
      ? totalDurationSec - currentTimestampSeconds 
      : avgDurationPerScene;
    
    const minutes = Math.floor(currentTimestampSeconds / 60).toString().padStart(2, '0');
    const seconds = (currentTimestampSeconds % 60).toString().padStart(2, '0');
    const timestampStr = `${minutes}:${seconds}`;

    const sceneTitle = generateSceneTitle(sceneNum, sceneDialogue, input.videoType);
    const location = determineLocation(sceneNum, sceneDialogue);

    const shots: Shot[] = [
      {
        id: `shot-${sceneNum}-1`,
        shotNumber: (sceneNum - 1) * 3 + 1,
        sceneNumber: sceneNum,
        shotType: i === 0 ? 'Wide Establishing' : 'Medium Shot',
        cameraMovement: 'Static or slow dolly in',
        cameraAngle: 'Eye level',
        framing: 'Subject centered',
        lensSuggestion: '35mm f/1.8',
        movementSpeed: 'Steady',
        composition: 'Rule of thirds',
        subject: `Creator presenting in ${location}`,
        duration: `${Math.round(sceneDurationSec * 0.35)} sec`,
        durationSeconds: Math.round(sceneDurationSec * 0.35),
        audio: `Dialogue: "${sceneDialogue.slice(0, 45)}..."`,
        description: `Establish scene atmosphere in ${location} with clear focal point.`,
      },
      {
        id: `shot-${sceneNum}-2`,
        shotNumber: (sceneNum - 1) * 3 + 2,
        sceneNumber: sceneNum,
        shotType: 'Close-up Detail',
        cameraMovement: 'Tracking or slow pan',
        cameraAngle: 'Slight low angle',
        framing: 'Tight crop on primary action',
        lensSuggestion: '50mm prime',
        movementSpeed: 'Controlled',
        composition: 'Leading lines',
        subject: `Key action or demonstration element`,
        duration: `${Math.round(sceneDurationSec * 0.35)} sec`,
        durationSeconds: Math.round(sceneDurationSec * 0.35),
        audio: 'Foley sound effects + background musical accompaniment',
        description: `Showcase tactile detail and expression to anchor audience attention.`,
      },
      {
        id: `shot-${sceneNum}-3`,
        shotNumber: (sceneNum - 1) * 3 + 3,
        sceneNumber: sceneNum,
        shotType: 'Cutaway / B-Roll Reaction',
        cameraMovement: 'Dynamic whip-cut or push',
        cameraAngle: 'Profile or high angle',
        framing: 'Environmental accent',
        lensSuggestion: '24mm wide or macro',
        movementSpeed: 'Quick transition',
        composition: 'Symmetrical / Golden ratio',
        subject: `Visual transition to next beat`,
        duration: `${sceneDurationSec - Math.round(sceneDurationSec * 0.7)} sec`,
        durationSeconds: sceneDurationSec - Math.round(sceneDurationSec * 0.7),
        audio: 'Voice-over continuation + rising transitional audio riser',
        description: `Smooth kinetic transition bridging to subsequent section.`,
      },
    ];

    const sceneProps = [
      `Key subject prop for Scene ${sceneNum}`,
      `Handheld device / accessory`,
      `Thematic background decor`,
    ];

    const sceneBroll = [
      `Macro cutaway reinforcing: "${sceneDialogue.slice(0, 30)}..."`,
      `Dynamic secondary angle of key action in ${location}`,
    ];

    scenes.push({
      id: `sc-custom-${sceneNum}`,
      sceneNumber: sceneNum,
      title: sceneTitle,
      duration: `${sceneDurationSec} sec`,
      durationSeconds: sceneDurationSec,
      location,
      purpose: `Advance the narrative of ${input.title} by illustrating: ${sceneTitle}.`,
      dialogue: sceneDialogue,
      visualDescription: `Visual depiction: creator actively demonstrates concepts related to ${sceneTitle} in ${location}.`,
      cameraDirectionSummary: `Start with ${shots[0].shotType} followed by punchy ${shots[1].shotType} and quick transition cut.`,
      cameraDetails: {
        shotType: `${shots[0].shotType} → ${shots[1].shotType}`,
        cameraMovement: input.tones.includes('Cinematic') ? 'Smooth slow gimbal push' : 'Dynamic handheld / tracking',
        cameraAngle: 'Eye level with slight low angle accents',
        framing: 'Rule of thirds with comfortable subject headroom',
        lensSuggestion: '35mm / 50mm combo',
        movementSpeed: input.tones.includes('Energetic') ? 'Fast & snappy' : 'Balanced',
        composition: 'Rule of thirds with environmental depth',
      },
      shotType: `${shots[0].shotType} → ${shots[1].shotType}`,
      lighting: input.tones.includes('Cinematic') ? 'Moody directional key with warm rim backlight' : 'Clean diffused 5600K daylight',
      props: sceneProps,
      broll: sceneBroll,
      audio: `Clear dialogue vocal track + ambient location sound + background instrumental.`,
      shots,
    });

    timeline.push({
      timestamp: timestampStr,
      sceneNumber: sceneNum,
      title: sceneTitle,
      duration: `${sceneDurationSec} sec`,
    });

    // Populate B-Roll
    brollList.push(
      {
        id: `br-custom-${brollList.length + 1}`,
        clipNumber: brollList.length + 1,
        visual: `Macro cutaway of key element in ${location}`,
        purpose: `Heighten visual variety during voice-over in Scene ${sceneNum}`,
        suggestedDuration: '2 sec',
        suggestedDurationSeconds: 2,
        sceneNumber: sceneNum,
        camera: '50mm f/1.8 macro, shallow focus',
        audio: 'Targeted crisp foley accent',
      },
      {
        id: `br-custom-${brollList.length + 2}`,
        clipNumber: brollList.length + 2,
        visual: `Environmental wide pan showing ambiance of ${location}`,
        purpose: `Pacing reset between core instructional beats`,
        suggestedDuration: '3 sec',
        suggestedDurationSeconds: 3,
        sceneNumber: sceneNum,
        camera: '24mm wide angle, steady gimbal track',
        audio: 'Lo-fi melodic instrumentation',
      }
    );

    currentTimestampSeconds += sceneDurationSec;
  }

  // Populate base props & equipment
  propsList.push(
    { id: 'pe-custom-1', name: 'Primary Topic Demonstration Prop', category: 'Props', prepared: true, notes: 'Main subject item' },
    { id: 'pe-custom-2', name: 'Secondary Context Props', category: 'Props', prepared: false, notes: 'Desktop or table styling' },
    { id: 'pe-custom-3', name: 'Notes / Cue Card Tablet', category: 'Props', prepared: true, notes: 'For quick script reference' },
    { id: 'pe-custom-4', name: '4K Camera / Main Phone (60fps)', category: 'Camera Equipment', prepared: true, notes: 'Primary recording unit' },
    { id: 'pe-custom-5', name: 'Sturdy Tripod & Fluid Head', category: 'Camera Equipment', prepared: true, notes: 'Locked-off and panning shots' },
    { id: 'pe-custom-6', name: 'Key Light with Dome Diffuser', category: 'Lighting', prepared: true, notes: 'Soft flattering face illumination' },
    { id: 'pe-custom-7', name: 'Wireless Lavalier Microphone', category: 'Audio', prepared: true, notes: 'Clean dialogue capture with no echo' }
  );

  return {
    id: `plan-${Date.now()}`,
    projectId: `proj-${Date.now()}`,
    summary: {
      totalDuration: input.targetDuration || `${totalDurationSec} sec`,
      totalDurationSeconds: totalDurationSec,
      sceneCount: scenes.length,
      shotCount: scenes.length * 3,
      propCount: propsList.filter(p => p.category === 'Props').length,
      brollCount: brollList.length,
    },
    scenes,
    propsAndEquipment: propsList,
    brollClips: brollList,
    timeline,
  };
}

function parseDurationToSeconds(duration: string): number {
  if (!duration) return 60;
  const lower = duration.toLowerCase();
  if (lower.includes('30')) return 30;
  if (lower.includes('60')) return 60;
  if (lower.includes('2 min')) return 120;
  if (lower.includes('5 min')) return 300;
  if (lower.includes('10 min')) return 600;
  const match = duration.match(/\d+/);
  return match ? parseInt(match[0], 10) : 60;
}

function generateSceneTitle(sceneNum: number, dialogue: string, videoType: string): string {
  const words = dialogue.split(/\s+/).slice(0, 4).join(' ');
  if (sceneNum === 1) return `The Hook: ${words || 'Opening Premise'}`;
  if (sceneNum === 2) return `Core Setup & Foundation`;
  if (sceneNum === 3) return `Action & Primary Demonstration`;
  if (sceneNum === 4) return `Key Turning Point & Insight`;
  if (sceneNum === 5) return `Final Execution & Assembly`;
  return `Conclusion & Strong Call To Action`;
}

function determineLocation(sceneNum: number, dialogue: string): string {
  const lower = dialogue.toLowerCase();
  if (lower.includes('kitchen') || lower.includes('coffee') || lower.includes('breakfast')) return 'Kitchen';
  if (lower.includes('bed') || lower.includes('wake') || lower.includes('room')) return 'Bedroom';
  if (lower.includes('desk') || lower.includes('work') || lower.includes('study') || lower.includes('computer')) return 'Studio / Office Desk';
  if (lower.includes('outside') || lower.includes('street') || lower.includes('city') || lower.includes('campus')) return 'Outdoor Urban Exterior';
  
  const defaults = ['Main Studio Setup', 'Workspace Desk', 'Minimalist Interior', 'Living Space', 'Hero Location'];
  return defaults[(sceneNum - 1) % defaults.length];
}

/**
 * AI Workspace Utility Actions
 */
export function improveShotAi(shot: Shot): Shot {
  const improvements = [
    {
      shotType: 'Low-Angle Hero Push-in',
      cameraMovement: 'Dynamic 3-axis smooth push',
      lensSuggestion: '35mm anamorphic / f/1.4',
      composition: 'Golden ratio with dramatic depth-of-field separation',
      cameraAngle: 'Slight low angle for elevated subject prominence',
      movementSpeed: 'Silky 24fps filmic cadence',
    },
    {
      shotType: 'Macro Eye-Level Glide',
      cameraMovement: 'Subtle lateral tracking',
      lensSuggestion: '50mm prime f/1.8',
      composition: 'Rule of thirds with clean leading room',
      cameraAngle: 'Eye level direct alignment',
      movementSpeed: 'Measured, contemplative pace',
    },
  ];
  const choice = improvements[Math.floor(Math.random() * improvements.length)];
  return {
    ...shot,
    shotType: choice.shotType,
    cameraMovement: choice.cameraMovement,
    lensSuggestion: choice.lensSuggestion,
    composition: choice.composition,
    cameraAngle: choice.cameraAngle,
    movementSpeed: choice.movementSpeed,
    description: `[AI Enhanced]: ${shot.description || shot.subject} with heightened visual impact and framing.`,
  };
}

export function makePlanMoreCinematic(plan: ProductionPlan): ProductionPlan {
  const updated = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
  updated.scenes.forEach(scene => {
    scene.lighting = `Cinematic 3-point setup with 3200K warm rim light, haze ambiance, and motivated key.`;
    scene.cameraDetails.lensSuggestion = '35mm or 50mm fast prime (f/1.4)';
    scene.cameraDetails.cameraMovement = 'Fluid gimbal tracking or slow slider push';
    scene.cameraDetails.composition = 'Strict rule of thirds with negative space & depth framing';
    scene.shots.forEach(shot => {
      shot.lensSuggestion = 'Anamorphic 40mm / prime';
      shot.cameraMovement = 'Subtle cinematic slow glide';
    });
  });
  return updated;
}

export function simplifyPlanProduction(plan: ProductionPlan): ProductionPlan {
  const updated = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
  // Reduce equipment to solo smartphone setup
  updated.propsAndEquipment = updated.propsAndEquipment.filter(
    item => item.name.includes('Phone') || item.name.includes('Smartphone') || item.category === 'Props'
  );
  updated.scenes.forEach(scene => {
    scene.lighting = 'Natural window light with simple portable clip-on ring light';
    scene.cameraDetails.lensSuggestion = 'Smartphone 1x & 2x native lenses';
    scene.cameraDetails.cameraMovement = 'Handheld steady or simple tabletop phone mount';
  });
  return updated;
}

export function adaptPlanForShorts(plan: ProductionPlan): ProductionPlan {
  const updated = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
  updated.summary.totalDuration = '60 sec';
  updated.scenes.forEach(scene => {
    scene.cameraDetails.movementSpeed = 'Fast-paced with quick kinetic whip transitions';
    scene.cameraDetails.framing = 'Vertical 9:16 optimized central crop';
    scene.shotType = 'Vertical 9:16 Tight Hook';
    scene.shots.forEach(s => {
      s.durationSeconds = Math.max(1, Math.min(3, s.durationSeconds));
      s.duration = `${s.durationSeconds} sec`;
    });
  });
  return updated;
}
