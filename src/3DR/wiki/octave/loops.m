% loops.m


loopErrors = [0.05022765764192954,0.09830714131633124,0.049976549230193436,0.049736649294520686,0.09239349895094502,0.05701296119560504,0.02007664915771992,0.1420007728240893,0.060818755956764246,0.0411552354648955,0.06794204078831367,0.08933672374728295,0.08475266981260071,0.12464429164240394,0.02779582470662692,0.04453420400032687,0.10908096604837873,0.11519208296744303,0.055477218187602796,0.06658311175019041,0.13388307767752822,0.13495005875380894,0.10623130285446587,0.09335434257946247,0.09004264875507752,0.12131303399343275,0.0738483634847452,0.07950111816169465,0.061506683189082034,0.12237138348882194,0.16756226868359722,0.11705319340086189,0.09843435934345486,0.08671245329911932,0.06439982676100038,0.11716914651269532,0.047252453379252775,0.1395144160991368,0.12651889725002227,0.09956278929324215,0.1996991226353475,0.19927375974995273,0.15850884089167158,0.12349605960513899,0.05413424940288216,0.16416524130512344,0.07401173763858851,0.12094533481645071,0.14089868054377322,0.057005989741064265,0.029837801315847224,0.08895955997853179,0.14314090341983254,0.12117565311877045,0.12863409429788084,0.06562106370713071,0.12369337414632249,0.09163743377554083,0.1351541638827891,0.06934209365584942,0.14208420015023807,0.06661000999096443,0.05063280287587318,0.09196464543169698,0.0825703441593063,0.16158363681839324,0.09228346968591643,0.04955223968390998,0.08260355649735793,0.10835315347522151,0.13505791507818643,0.07086634457059175,0.11169630110081773,0.13131528122169525,0.10350398161858232,0.10034680760073082,0.045511580238548725,0.06426045104475873,0.13444938133840853,0.06071057568746171,0.08867098629305303,0.07745502095662193,0.0911914558868941,0.06535128767685475,0.10557826870915756,0.12984726015995116,0.11714235762448799,0.024301401836412256,0.0929133771150412,0.08745302286133237,0.11413094471855577,0.07073832164398192,0.05771186591155935,0.07043806531568791,0.08193871386599884,0.12164673501426097,0.12985708925747588,0.10396779567790297,0.030473164744837692,0.07365242157676084,0.12846677649469487,0.10864611316435413,0.0885552243578857,0.147504853211183,0.10281867420494821,0.07956076875623902,0.10979700400422288,0.09881391184252036,0.05220512199158662,0.05868861643715858,0.1831360624367033,0.16562941574949017,0.09766561009013132,0.09603558864476029,0.15452212094512444,0.11784356140555034,0.08390706611565552,0.11869432496768305,0.057193230963479426,0.046825044681650545,0.04991597062017824,0.053336888342013646,0.08113578792032043,0.10337450328153082,0.052324063154011356,0.044798381661765564,0.14385871754816945,0.12225677715100747,0.0809169119772917,0.09875191358391333,0.04139243018887658,0.041309448134674846,0.13384941648511972,0.07225969329794799,0.13200407442000828,0.02873942099079348,0.08341910309952678,0.1155627594922094,0.04888546996928774,0.07267255259011067,0.0589445495815997,0.10695616595282958,0.07814564267770148,0.015458333321239047];

% 1
loopErrors = [0.00508237279001387,0.2895551143781321,0.007653808037519016,0.008127305225625608,0.28290309805358166,0.004364449658075943,0.006775930314339716,0.28872550802568187,0.003920518319014155,0.009602442811559317,0.0069645414368172875,0.011123581959737186,0.28923284561683343,0.2893521989042585,0.010586374908266414,0.00661851064209398,0.0059613604572244005,0.00871969261784725,0.009857709853240413,0.005325767442139366,0.2875698954925582,0.006450714431690339,0.005786791515957763,0.006956412732545038,0.011632961251520113,0.28201579347834427,0.0030591231348728004,0.28580943406823267,0.0028354166316599747,0.2883278630899127,0.2882867862103205,0.003378300343756251,0.2808200149061108,0.28702197840525484,0.28290026506338667,0.003957015603574677,0.005429568768267851,0.2895015830679443,0.2853446105268701,0.006276405847262113,0.28786870159065586,0.27915954507535923,0.004608038392585408,0.0024551511140928762,0.2829385824822215,0.2858194107229208,0.29195538208643823,0.2884654295025715,0.2779524867434831,0.28400638836483044,0.005877892766656667,0.007237478281219237,0.003318714747454453,0.004676554810118569,0.006368017834613493,0.005732450003767073,0.005663260813361495,0.006153921238622692,0.006618333291659313,0.0038376079660964054,0.0041102412183850094,0.003449517700576729,0.010893538957013628,0.008459646189241358,0.0024614124783955333,0.007339025626711797,0.006110707004038786,0.0042835145028144615,0.005297515539642865,0.010125869134203179,0.012043426425505608,0.007056718169548838,0.004374466967191729,0.008832448321994537,0.005501128262772231,0.0029403925506242593,0.006331804879353441,0.011995951932895632,0.00998312596451311,0.006138280191057621,0.004640212705684689,0.0024669523927789553,0.0091474391530937,0.006781032035292716,0.011101653386518221,0.004717663533550264,0.00854327104318021,0.0027911298909713595,0.005337715367498161,0.007620986196015055,0.009980867773504036,0.004192740408874202,0.00793976486554409,0.006508671362656608,0.00478661111673971,0.010943578426018542,0.012379461159771376,0.010290820715599397,0.006498328349824095,0.01085128532062458,0.0049932227076202925,0.002412224043519887,0.00532996653229668,0.008036048179138307,0.004480225238567069,0.0035295522329716216,0.0033588192333111853,0.002779769062891227,0.004304659106794436,0.006084803747497358,0.007714558019818812,0.00631415858119164,0.004250058086070075,0.0063612709828933245,0.006375836163438842,0.0062930064501656524,0.005883122439935453,0.003725288816396933,0.0019795415633844043,0.0036541960172416788,0.0055528126193197394,0.003487330643495915,0.005751117056760882,0.005049391620626335,0.002082969287600947,0.006740930590214941,0.0061999054600290196,0.005416854029392566,0.004050167739311115,0.004605186851680972,0.0019800715943371454,0.004745586304116108,0.006980679462184172,0.00685703044493985,0.002849337675438251,0.004881027558213419,0.0042194583230121905,0.006366008784174454,0.004065335554867082,0.004884915093213551,0.004429561807943259,0.004705720566927949,0.006351852112866675,0.0028079203304157544];

% 3
loopErrors = [0.00278726986067894,0.3485205535410565,0.0047820799228603245,0.006406853008496162,0.34983712469480804,0.016904803180947135,0.007787226715864795,0.34644711393415717,0.013960221973115833,0.3613302415912553,0.015538550829541475,0.3623835535341395,0.3460949419370789,0.5102870165457922,0.012282907729402166,0.011016112786722662,0.008987691872335736,0.3636216413989836,0.008022241807606677,0.008255917242971469,0.3392008745287451,0.3656007217628412,0.013851081038925564,0.005441820459773977,0.0065120445461637365,0.3477809497007602,0.017769040202721544,0.3411117151545038,0.011552582581077511,0.34398611169228394,0.5094734388921826,0.009767171162348915,0.33998413466620364,0.5141051230605574,0.32834777709762625,0.3611575677092816,0.011721513684354335,0.5113795479546778,0.33326559333910094,0.35601867843226226,0.3333498413813079,0.330786662435047,0.015037262176308885,0.012238536801649014,0.334801976195249,0.5123575003887096,0.5170690031293715,0.5169373627259669,0.3296274240293157,0.31604454670186327,0.009556291076503194,0.35977335094331014,0.009010368687827341,0.0028916336716740816,0.3639808836557144,0.00961711057662267,0.006600620868092179,0.3531089716483084,0.015044409621744118,0.010871359384343693,0.006679657361788931,0.0022271119992188174,0.37359404584424,0.36888378375238134,0.002772123237894895,0.008676391136347902,0.00811803717486012,0.015396232992015611,0.0102757859912468,0.015025763050802492,0.353856812318011,0.024293872722163833,0.017237476204679227,0.011109799490234102,0.008910027871340143,0.3572103632459562,0.0017490943083833387,0.36680811103773586,0.009261243730609783,0.3667995637342257,0.36206756011898406,0.013744068941698134,0.35772688894555554,0.3674574638304932,0.3652995214886567,0.015169953432811786,0.011845693397981883,0.36747481995612197,0.3652798024699459,0.005162970038742116,0.3617335872690779,0.35622029097449054,0.011606545776593508,0.20973583718665698,0.3631123643675096,0.3620639479385814,0.37113254904367693,0.5086834618135327,0.36160868282952535,0.5009713540592072,0.009145039679090847,0.004391709690202412,0.01474670517388075,0.01560370585098656,0.016023965665306526,0.010890152611165571,0.0023029954245486484,0.004782691283648993,0.010955526914504597,0.208231086880544,0.007910744851052302,0.2030138089350646,0.014652964157784554,0.21065665095779218,0.012659904207161107,0.014562027182321765,0.20837090681836856,0.006815575700133435,0.010801105022603627,0.009475155283024894,0.016721783405604557,0.20813577855841955,0.014537131802153984,0.00982640201337419,0.006278468987242956,0.016303453377651943,0.007420953520864356,0.205347036043784,0.2033958407867522,0.011749501968516811,0.009564058171914426,0.011119166371934455,0.014923199819917667,0.20326898699990803,0.20537189264834801,0.21267603791229692,0.2044405706880481,0.012293992985142098,0.21407260500658853,0.2026854390099314,0.21456867546499536,0.01273812513305017,0.20231592133306278,0.007649250210545592];






% edges ?
errors = [0.014331595086798729,0.07549989384661228,0.33862678576170263,0.3157753741563893,0.20654800365526352,0.34016090198291815,0.3460326746210867,0.333776738725409,0.3152443725615221,0.13899471254083232,0.260403610130259,0.08792882511213741,0.03026294347950557,0.35131480552280925,0.2230908975433793,0.32461008961814813,0.3242045762606173,0.04024776527276034,0.3623082971845532,0.15328937754439428,0.32259525811785955,0.5531675127785443,0.25335764685763945,0.3248381093836541,0.13283907256756536,0.3668640566619785,0.021012627777554752,0.30698441499799656,0.3422961325076361,0.249000952640161,0.24243613317662197,0.5604668863258272,0.5606476062842725,0.009124493485225588,0.02180858717886365,0.26799409854678613];
errors = [0.014331595086798729,0.07549989384661228,0.33862678576170263,0.3157753741563893,0.20654800365526352,0.34016090198291815,0.3460326746210867,0.333776738725409,0.3152443725615221,0.13899471254083232,0.260403610130259,0.08792882511213741,0.03026294347950557,0.35131480552280925,0.2230908975433793,0.32461008961814813,0.3242045762606173,0.3422961325076361,0.249000952640161,0.24243613317662197,0.5604668863258272,0.009124493485225588,0.02180858717886365,0.26799409854678613];

errors = [0.0006726527624196421,0.017838700709705273,0.3594381266513804,0.3009130084890734,0.12815758573109168,0.41053922910436735,0.3785147156394916,0.3769211551742274,0.3167357070710025,0.05964775329006749,0.2419238326516906,0.023877476397327554,0.0028449824546553093,0.4267940755252257,0.14888051376885952,0.32813910964929277,0.3669757208083573,0.4013324743620572,0.22132370010253238,0.2095313520896108,1.161876832876104,0.00025225793849211213,0.0016806881755049427,0.23702677509872294];
errors = [0.0006726527624196421,0.017838700709705273,0.3594381266513804,0.3009130084890734,0.12815758573109168,0.41053922910436735,0.3785147156394916,0.3769211551742274,0.3167357070710025,0.05964775329006749,0.2419238326516906,0.023877476397327554,0.0028449824546553093,0.4267940755252257,0.14888051376885952,0.32813910964929277,0.3669757208083573,0.005430031161492651,0.4571263529828036,0.07138015071838166,0.35242891686728395,1.1011346119685186,0.2298662604783523,0.3394764051339469,0.05529052106969423,0.47271840101882445,0.0016837278542408123,0.31029749885745517,0.4013324743620572,0.22132370010253238,0.2095313520896108,1.161876832876104,1.1359393742718287,0.00025225793849211213,0.0016806881755049427,0.23702677509872294];

errors = [0.0006726527624196421,0.017838700709705273,0.3594381266513804,0.3009130084890734,0.12815758573109168,0.41053922910436735,0.3785147156394916,0.3769211551742274,0.3167357070710025,0.05964775329006749,0.2419238326516906,0.023877476397327554,0.0028449824546553093,0.4267940755252257,0.14888051376885952,0.32813910964929277,0.3669757208083573,0.005430031161492651,0.4571263529828036,0.07138015071838166,0.35242891686728395,0.2298662604783523,0.3394764051339469,0.05529052106969423,0.47271840101882445,0.0016837278542408123,0.31029749885745517,0.4013324743620572,0.22132370010253238,0.2095313520896108,0.00025225793849211213,0.0016806881755049427,0.23702677509872294];
errors = [0.0006726527624196421,0.017838700709705273,0.3594381266513804,0.3009130084890734,0.12815758573109168,0.41053922910436735,0.3785147156394916,0.3769211551742274,0.3167357070710025,0.05964775329006749,0.023877476397327554,0.0028449824546553093,0.4267940755252257,0.14888051376885952,0.32813910964929277,0.3669757208083573,0.005430031161492651,0.4571263529828036,0.07138015071838166,0.35242891686728395,0.3394764051339469,0.05529052106969423,0.47271840101882445,0.0016837278542408123,0.4013324743620572,0.00025225793849211213,0.0016806881755049427,0.23702677509872294];

loopErrors = sort(errors);

hold off;
plot(loopErrors,'r-');



% hist(loopErrors);

hist(loopErrors,20);






