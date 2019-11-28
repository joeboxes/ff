% surfD.m









% start
hold off;
del = 0.1; 








countX = 11;
countY = 11;
x = [0.04300210612675184,0.04787889583316596,0.05274067616742966,0.0575893376593577,0.0624267708387648,0.06725486623546571,0.07207551437927517,0.07689060580000794,0.08170203102747872,0.08651168059150229,0.09132144502189335,0.04282295667153235,0.04769666473200679,0.05255681626403013,0.0574053017974171,0.062244011861982446,0.06707483698754091,0.07189966770390721,0.07672039454089612,0.08153890802832235,0.08635709869600067,0.09117685707374579,0.042648256352771974,0.04751888196127953,0.05237740388503528,0.05722571265385396,0.06206569879755033,0.0668992528459391,0.07172826532883503,0.07655462677605286,0.08138022771740733,0.08620695868271318,0.09103671020178512,0.042475948340787766,0.04734349069130121,0.05220038220076215,0.05704851339898533,0.06188977481578549,0.06672605698097737,0.0715592504243757,0.07639124567579524,0.08122393326505072,0.08605920372195686,0.09089894757632844,0.042303975805896794,0.047168434092388904,0.05202369438152782,0.05687164720312827,0.061714183087005006,0.06655319256297276,0.07139056616084627,0.07622819441044029,0.08106796784156955,0.0859117769840488,0.09076151236769275,0.04213028191841611,0.04699165533485966,0.051845283597649325,0.056693057236599835,0.06153686678152592,0.06637860276224233,0.07122015570856381,0.07606341615030508,0.08091027461728091,0.08576262163930602,0.09062234774619515,0.04195280984866277,0.046811097589030556,0.051663093019443745,0.05651068666971708,0.0613557690696653,0.06620023074910315,0.07104596223784536,0.07589485406570667,0.08074879676250185,0.0856096808580456,0.09047939688215267,0.041769502766953834,0.04662470402521862,0.05147506581722812,0.05632247867279706,0.0611688331217402,0.06601601969387226,0.07086592891900799,0.07572045132696213,0.08058147744754943,0.0854508978105846,0.0903306029458824,0.04157830384360636,0.04643041781374093,0.05127914516131952,0.05612637641615685,0.06097400210806767,0.06582391276686672,0.07067799892236876,0.0755381511043885,0.08040625984274068,0.08528421566724007,0.09017390910770137,0.04137715624893741,0.04622618212491454,0.05107327422203499,0.055920323070113485,0.06076921919896478,0.0656218531384036,0.07048011541824471,0.07534589656830282,0.08022108711839268,0.08510757759832906,0.09000725853792665,0.04116400315326403,0.0460099401290565,0.0508553961696916,0.05570226180498404,0.06055242756474858,0.06540778397879995,0.07027022157695291,0.07514163088902218,0.0800239024448225,0.08491892677416864,0.0898285944068753];
y = [0.47188128276596275,0.4730226052412513,0.47354664360082555,0.47353114886672887,0.47305387206100463,0.4721925642056962,0.47102497632284684,0.4696288594345,0.4680819645626989,0.466462042729487,0.46484684495690753,0.46936351949949695,0.47037810442242484,0.4708351557194796,0.4708124244127046,0.4703876615241432,0.46963861807583873,0.46864304508983445,0.46747869358817384,0.4662233145929002,0.46495465912605677,0.463750478209687,0.467028733991017,0.46791654821244283,0.4683065792978367,0.4682765782692419,0.4679042961487018,0.46726748395825984,0.4664438927199593,0.4655112734558434,0.4645473771879557,0.46362995493833936,0.4628367577290378,0.46479233587396485,0.46555334624474715,0.4658763239693386,0.4658390200697826,0.46551918556812244,0.4649945714864015,0.4643429288466631,0.4636420086709506,0.46296956198130734,0.46240333979977666,0.4620210931484019,0.4625697347817824,0.46320390815277973,0.4634597993674273,0.4634151594477686,0.4631477394158469,0.4627352902937056,0.46225556310338795,0.46178630886693733,0.46140527860639713,0.4611902233438106,0.4612188941012212,0.46027634034791154,0.4607836435699824,0.46097241512554477,0.4609204060366419,0.4607053673253172,0.46040505001361404,0.46009720512357566,0.4598595836772455,0.4597699366966669,0.4599060152038831,0.46034557022093753,0.45782756220579424,0.4582079621297972,0.45832958087713277,0.45827016946984434,0.4581074789299752,0.4579192602795687,0.4577832645406682,0.457777242735317,0.4579789458855585,0.45846612501343603,0.4593165311409929,0.4551388099888723,0.45539227346566596,0.4554467062556333,0.4553798593808179,0.4552694838632628,0.45519333072501156,0.45522915098810746,0.4554546956745938,0.455947715806514,0.4567859624059113,0.4580471864948292,0.4521254933305877,0.45225198721103055,0.4522392008944883,0.45216488540300437,0.45210679175862195,0.4521426709833845,0.4523502740993353,0.45280735212851775,0.45359165609297514,0.45478093701475086,0.45645294591588825,0.4487030218643824,0.448702512999333,0.44862247442713965,0.44854065716984576,0.44853481224949454,0.44868269068812944,0.4490620435077937,0.4497506217305308,0.450826176378384,0.4523664584733966,0.45444921903761204,0.44478680522369823,0.44465926046401516,0.44451193648702925,0.44442258431478393,0.4444689549693225,0.44472879947268823,0.4452798688469246,0.44619991411407484,0.44756668629618235,0.44945793641529047,0.45195141549344253];
z = [-0.7591326293124586,-0.7582136943814191,-0.7576772800379155,-0.7574752052808876,-0.7575592891092757,-0.7578813505220198,-0.7583932085180598,-0.7590466820963359,-0.7597935902557879,-0.7605857519953559,-0.7613749863139802,-0.7549910002009718,-0.7541506024001737,-0.7536556988129975,-0.7534581084383833,-0.753509650275271,-0.7537621433226006,-0.7541674065793122,-0.7546772590443459,-0.7552435197166417,-0.7558180075951395,-0.7563525416787794,-0.7507359828494364,-0.7499741427208454,-0.7495207704319623,-0.7493276849817272,-0.7493467053690801,-0.7495296505929608,-0.7498283396523098,-0.7501945915460667,-0.7505802252731717,-0.7509370598325648,-0.751216914223186,-0.746419996485712,-0.7457367345712936,-0.7453249141226693,-0.7451363541387789,-0.7451228736185624,-0.74523629156096,-0.7454284269649117,-0.7456510988293575,-0.7458561261532374,-0.7459953279354914,-0.7460205231750595,-0.742095460337658,-0.741490797179378,-0.7411205491129779,-0.7409365351373978,-0.7408905742515777,-0.7409344854544576,-0.7410200877449777,-0.7410992001220779,-0.7411236415846982,-0.7410452311317787,-0.7408157877622594,-0.7378147936331342,-0.7372887497729579,-0.7369600946307476,-0.7367806472054435,-0.7367022264959853,-0.7366766515013132,-0.7366557412203673,-0.7365913146520874,-0.7364351907954138,-0.7361391886492864,-0.7356551272126451,-0.7336304155999996,-0.7331830115798929,-0.732895969903838,-0.7327211095707753,-0.7326102495796446,-0.7325152089293862,-0.7323878066189398,-0.7321798616472456,-0.7318431930132435,-0.7313296197158737,-0.7305909607540763,-0.7295947454661141,-0.7292260018280423,-0.7289805941601085,-0.7288103414612529,-0.7286670627304154,-0.728502576966536,-0.7282687031685547,-0.7279172603354117,-0.727400067466047,-0.7266689435594005,-0.7256757076144122,-0.725760202459337,-0.7254701397452659,-0.7252663866274187,-0.7251007621047357,-0.7249250851761568,-0.7246911748406222,-0.7243508500970718,-0.7238559299444456,-0.7231582333816836,-0.7222095794077259,-0.7209617870215126,-0.7221792058075279,-0.7219678445594229,-0.7218057665336279,-0.7216447907290833,-0.7214367361447287,-0.7211334217795043,-0.7206866666323503,-0.7200482897022065,-0.7191701099880129,-0.7180039464887097,-0.7165016182032368,-0.7189041747385462,-0.718771535498373,-0.7186511531065959,-0.718494846562155,-0.7182544348639903,-0.7178817370110419,-0.7173285720022498,-0.7165467588365538,-0.7154881165128943,-0.7141044640302111,-0.7123476203874444];
px = [0.06605005742825493,0.06448898435585411,0.062298342576358266,0.06889905567512175,0.06860111395024107,0.06350732209923021,0.07097793321867335,0.06524806001244204,0.06905958746129455,0.06321871233028822,0.06178926228169503,0.06156431474807748,0.06386760513021728,0.06419945077389048,0.0724047629689425,0.06842946289346727,0.05723255371318237,0.0743300673993834,0.060297830835472896,0.06169949133435689,0.06461880450919547,0.06523115960341125,0.06664086793389815,0.07009265842588773,0.07271129008843231,0.05616415559716086,0.07234702127995937,0.06658214445933977,0.061177026549579225,0.058021769226212626,0.06658769971294284,0.060937427865855,0.05879537560939162,0.07613293529504564,0.07244420703548304,0.07586152287232267,0.07185884830086248,0.07222752545647776,0.05738567354466541,0.07820701527297799,0.06428127484477489,0.06990173080350559,0.058827503680283666,0.0748344050744526,0.07221614529750132,0.061330164665618574,0.06096724670776492,0.07424976873095196,0.05445060684887517,0.06400405006918994,0.0583907178205585,0.06331864983954852,0.054580884036095144,0.054809646219552595,0.05401656671600833,0.07967323048721461,0.07575788047615645,0.07466337834603273,0.06480496643003064,0.07912541464962915,0.06622854958463215,0.06666335309289131,0.0662918758686956,0.08085774825968187,0.0536478943416318,0.05532937107037999,0.06453938759819004,0.0754289621880816,0.056336814491361055,0.07931144870858503,0.06345161323093228,0.07271094444659984,0.05708034525475582,0.05950307164824409,0.07356530359526123,0.0656727367664387,0.062187389410706694,0.07781459314724443,0.050389890643853505,0.06814112746145348,0.05951441950671547,0.07499787043118047,0.054780462094269754,0.05588187284084775,0.06628278804403956,0.05504375123832216,0.07641859649338337,0.06227594797632481,0.06715315723816184,0.05064523017346034,0.06046439234407826,0.06985374245123048,0.07826625416938879,0.08368476481985741,0.05144705000293769,0.0570404964726464,0.08315267438680395,0.06607490310118558,0.05036023097847048,0.05499563188864038,0.05297378470279311,0.07012014711262207,0.04962383043402424,0.08359177741444014,0.08083357772796328,0.0667956825849498,0.056356370996069376,0.051291390761380444,0.04871536736332638,0.08193900795066944,0.07238652502635573,0.05080866573136809,0.07349451750776587,0.06261741559633616,0.049975809571528626,0.04738724120634115,0.060099448733734004,0.06731337370718626,0.056935581049722475,0.0552036972167524,0.06762646802420721,0.07839264799020199,0.06633806616265389,0.0800413661257102,0.05889365949139821,0.07100688549918494,0.07781654688825579,0.08589088219271679,0.05127258221480429,0.047687493281390866,0.08357972189375623,0.04989917890959726,0.06448224320443269,0.05706302333905806,0.07018692298645077,0.08658274285241675,0.07707530007356567,0.05964396678105348,0.04805748566126185,0.058520805161308954,0.07500760880248027,0.04525172460198505,0.08100823377046981,0.08473638650557137,0.07923487698493875,0.053112312403147156,0.07547351478068713,0.059252719110998636,0.05670349783782007,0.046428901457140306,0.07239077107871905,0.08715264963202699,0.04996528910044769,0.049350326647758264,0.05715999958083262,0.045403696246383504,0.05492620416509548,0.04960350536205414,0.05988111604407471,0.07326622273033867,0.06653384282347105,0.08827453489135043,0.048414051920190215,0.08001396913661354,0.052172962332296235,0.08463774818642703,0.052714222774893786,0.05497239972613588,0.07164628522480677,0.0643572874544065,0.05246163053772715,0.04439116279298559,0.043981745254024915,0.06764443930607239,0.0617429090932645,0.06461114100324106,0.08347314169519968,0.08482204964953644,0.051058143758494094,0.04512816624098999,0.061065640810556245,0.06166814331921638,0.06470739616373658,0.046940276917588925,0.08716102790095026,0.043273343182140975,0.077422811276628,0.05610766952859279,0.04805555616043615,0.0821843135099401,0.04200832026713401,0.07444287506429115,0.08998922334253767,0.05905953758227852,0.04459113510762781,0.06391670476054871,0.08466337304648607,0.09009250329160925,0.04405743238565733,0.07100263771591618,0.052612512080379835,0.04819855118266915,0.06504761459136416,0.08737181896754034,0.04863254067878843,0.06562970051542216,0.04228921501277928,0.07116885846603901,0.08666557024022378,0.09040234698081095];
py = [0.45442887480218785,0.45607183612153923,0.4569698221904951,0.45868857772851457,0.4561500471824229,0.4606250490586348,0.46092269761293225,0.458802906588081,0.45918704179952274,0.4523881895022124,0.4621917928448981,0.4613713663147373,0.46309472032845556,0.448308349381207,0.46165424065985244,0.46384544573880604,0.45563165565591146,0.45955567926725793,0.4622617466158645,0.4599956213538023,0.4602573578716428,0.46453250035151317,0.45263109617736674,0.4589543907783587,0.456516868403967,0.4581541774204395,0.4569950555474709,0.45591119532022756,0.4647437387844219,0.4624070302236289,0.46361537362407007,0.45720780400261024,0.4599434830095835,0.45515532649069007,0.45935203539905123,0.4590563623428593,0.46524339302434037,0.46051030491991507,0.4636259967260983,0.4579475888854331,0.4575650991169017,0.4533047847140554,0.4555047109619109,0.45114135082134416,0.46595771698385857,0.4571504684528426,0.4549461065986212,0.4649272400396748,0.45947521016486126,0.46530983827878336,0.46547045001049575,0.44697500253016276,0.4606678618840597,0.4622190343104261,0.45618219880157895,0.4555945873178714,0.45715989957358927,0.46517881426971186,0.45700201560981796,0.4577464143968027,0.4688002032656322,0.4652152865999566,0.46385868731846064,0.45398180891458095,0.46255748711817585,0.46440377913904074,0.4511516513167044,0.46347960000743404,0.4657326019055387,0.45429699261685486,0.4683415240282216,0.46526881904245476,0.4542042856483741,0.4528711025128012,0.46315246601807497,0.4542095012427881,0.4550480139571974,0.4620495872900653,0.45849698889830215,0.46522130600314804,0.46783520473779694,0.46634487719587625,0.46583293903578693,0.45465960414600837,0.44830529771959354,0.46754165285151195,0.4663460433750877,0.47064727459530886,0.4505399422127775,0.4626810801908776,0.45157271066485244,0.46842252648256066,0.4673352600135299,0.45872163309029,0.4577490150200255,0.45139744306960816,0.45622380713247257,0.4701405921110582,0.4639890890841239,0.46893666283301527,0.4518143225714944,0.45682322874184506,0.46183251463970937,0.44744754566803197,0.4584167005854858,0.460791034581645,0.4528957868486797,0.46530982519390374,0.4625606790114356,0.4609561492996141,0.46861712471662653,0.46221042114044664,0.470029695439209,0.47290092168333053,0.4648066554818707,0.45944140299849434,0.45013591566614874,0.46718419857986637,0.4493662404577915,0.4705801220478677,0.4476363374384104,0.46879314220330204,0.4667505317685501,0.46748092128615576,0.44963353662188493,0.45138228809913705,0.4632336392921541,0.45861321534381594,0.4681219540746374,0.4562897774712392,0.4484280676167449,0.4607054027588181,0.44731853632890717,0.4703345180763057,0.44682078105252765,0.46121275174488474,0.46958135593271544,0.4443578447792461,0.45784440780619895,0.4476325423633025,0.4555067323997207,0.4610307590398092,0.46493957659869134,0.4662754325984799,0.45232456003511556,0.4664408382183234,0.4686749928146473,0.4433842923163788,0.44896534317329756,0.45691041158604573,0.46742320990138053,0.4475892503699804,0.45830026206954644,0.4546992122657736,0.4462467836548242,0.46298011048370435,0.4697757684244707,0.4513268063156957,0.44870039015441954,0.47174591171427993,0.4719884912999405,0.45230427734820455,0.4670686397073508,0.46961430252358916,0.4667257152476416,0.4411366775527175,0.45737073175297094,0.4702452917277424,0.4470585240684484,0.44696474835839256,0.46927715952598925,0.459563419624821,0.4600808915922977,0.44271469042837874,0.4480335109146476,0.4725202254143753,0.4549026404177945,0.4483006106415317,0.45462981852654105,0.45949200301651477,0.4472732363564821,0.47254900757707885,0.4679511398511661,0.44765052854559984,0.45894644948493535,0.459441385838374,0.4688756670778217,0.47234326311050545,0.4692896171995041,0.47065023333139266,0.45506194283669554,0.4531586247632088,0.4555431051093924,0.4736093729911984,0.452457449767773,0.4458546027822755,0.4670006150715692,0.4504255066649501,0.4650864895359265,0.44944440428879706,0.45206654651544365,0.4703637645343239,0.47324154737854224,0.463479548914866,0.4707447367855281,0.44437502346764535,0.46180397302385856,0.4721793234698692,0.4524664843752285,0.4546948339075747];
pz = [-0.7409046919913336,-0.741526540389032,-0.7404481537737552,-0.7426355605779096,-0.735326550200867,-0.7417162445138564,-0.7424508107779715,-0.7336419844722246,-0.7344624489239826,-0.7326940360585225,-0.7397612483757142,-0.737115707069427,-0.7434904998830025,-0.7338366030056606,-0.7414992398349415,-0.7411780205671105,-0.7368555617849049,-0.7390102430255245,-0.738620627733865,-0.7337973393549426,-0.7328472315440399,-0.7405205342836665,-0.7307528178089847,-0.7321059335071363,-0.7325641201211441,-0.737828094035573,-0.7317217074794481,-0.7295858223230426,-0.7398247833154229,-0.7382768979674532,-0.7480062687867725,-0.730776503949175,-0.7333801402400142,-0.7341230771223343,-0.7500531774652697,-0.7350611642985792,-0.738620757369726,-0.7318669693825597,-0.7393376620317851,-0.7383348692393628,-0.7284974587989955,-0.7285794735812855,-0.7301786295186453,-0.7318558172599862,-0.7387657403665169,-0.7287531133566157,-0.728596375142555,-0.7418292345147426,-0.7363269730497067,-0.7485986013328936,-0.7420755410856504,-0.7298112578403093,-0.7366678288659911,-0.7395353888843043,-0.7342882486479552,-0.7381210949270778,-0.7311056846181087,-0.7380150361998281,-0.7270810822799929,-0.7451274206389793,-0.7420871598976793,-0.7505735747549949,-0.7298888795679666,-0.7415698618269998,-0.7421635613495282,-0.7381235413300187,-0.7264017885474778,-0.733281439272726,-0.7448189572753269,-0.7322124633324141,-0.7485967076217727,-0.7511166849955266,-0.727199760484379,-0.7258914772719169,-0.7527508596762321,-0.7241090516604489,-0.724545798434532,-0.7314430078610965,-0.7359231958730019,-0.7538615621574601,-0.7490791219490665,-0.7325586047468331,-0.7469263901945693,-0.726804822333526,-0.7244666091944914,-0.7447960250511494,-0.7487908259354121,-0.7469570977368019,-0.723463866991821,-0.736527790621123,-0.72396960488535,-0.751682675106751,-0.7375656710704418,-0.7411358311460783,-0.7306361800828515,-0.7254033093336186,-0.7348338797819571,-0.7504253142985314,-0.7410656673207303,-0.7442627791314194,-0.7278239451437494,-0.7228294597635601,-0.7358751193120114,-0.7429767223316163,-0.7295862136772143,-0.7588704253689026,-0.7245310830545768,-0.7463265674144905,-0.7428599844397265,-0.7496137014323265,-0.7526191765556276,-0.7315025883854621,-0.7502320243800356,-0.7467495685422866,-0.7455633156741628,-0.7369793784819704,-0.7225776464042439,-0.75595335209229,-0.724033094287369,-0.7463961452353244,-0.7218882549300195,-0.7486034106655346,-0.7574307295294568,-0.7489061110469061,-0.7220329188726418,-0.7208939946925218,-0.7559001041139788,-0.7467267182377245,-0.7477727139728855,-0.7301497632578605,-0.7518825130000234,-0.7280654365549204,-0.7205528659060457,-0.7524592748563688,-0.7210910348422817,-0.7422138532225341,-0.7517999765144079,-0.7226869070260064,-0.7290579411588576,-0.7215943410151837,-0.72101864949402,-0.7383354439400222,-0.7285132280097684,-0.7419622193913912,-0.7232100017564594,-0.7544864396239034,-0.7552505510826092,-0.7227228277208424,-0.7213697836086228,-0.730513485814667,-0.757967586918486,-0.7437932370357331,-0.7258226747371271,-0.7259752332697736,-0.7220363393033105,-0.7436059972478708,-0.7530489027122783,-0.7257155111418959,-0.7198948324373103,-0.7536552304718755,-0.7552568793733101,-0.7366531799755228,-0.7479859117181452,-0.7508749538783018,-0.7543849071759213,-0.7390422411396752,-0.7224801662719738,-0.7532992756699022,-0.7198986461130922,-0.7192092469287366,-0.7521564241344253,-0.7347168011843734,-0.745166877700532,-0.7208841890999825,-0.7189685815812668,-0.7554574563860027,-0.7252366335182497,-0.7280537593642137,-0.722636167187001,-0.731094970641679,-0.7189023728503875,-0.7555442024783404,-0.7603852780560916,-0.7284411633559174,-0.7308371240610694,-0.7359319937273999,-0.7561082838444254,-0.75341400201957,-0.7465820843661586,-0.7334934686385025,-0.7404237668154202,-0.7183829403708398,-0.7383391681147798,-0.7537986732302451,-0.7296223403250384,-0.7182035819327159,-0.7504474593158842,-0.7392852283344087,-0.7411319356410652,-0.7174771344034988,-0.7204664035050662,-0.7465460235298088,-0.7567025451087067,-0.7494020525152585,-0.7480579520900732,-0.7180909031497297,-0.7427565632132246,-0.7577186828022251,-0.7549404092079004,-0.7351630171942505];

% original point 
ox =0.06605005742825493;
oy =0.45442887480218785;
oz =-0.7409046919913336;
% projected point 
fx =0.06652229358564844;
fy =0.4607831538404367;
fz =-0.7373618909709505;
% local plane normal 
nx =-0.0206640526245069;
ny =-0.8498417737642395;
nz =-0.5266326580211135;

% surface normal 
sx =-0.0611351615201612;
sy =-0.8702687856486042;
sz =-0.4887685881392213;
curvature = 11.750361340742483;


















tx = reshape(x, countX,countY);
ty = reshape(y, countX,countY);
tz = reshape(z, countX,countY);

mesh(tx, ty, tz);

hold on;
% neighborhood points
plot3(px,py,pz, 'r*');
% original point
plot3(ox,oy,oz, 'bo');
% projected point
plot3(fx,fy,fz, 'b*');


% normal
plot3([ox,ox+del*nx],[oy,oy+del*ny],[oz,oz+del*nz], 'k-*');
plot3([fx,fx+del*sx],[fy,fy+del*sy],[fz,fz+del*sz], 'k-*');





axis equal;































%

% ...