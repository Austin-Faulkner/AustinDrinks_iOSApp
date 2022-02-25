//
//  DrinkingEstablishmentsListViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/20/22.
//

import UIKit

class DrinkingEstablishmentsListViewController: UIViewController, UICollectionViewDelegate {
    var selectedEstablishment: EstablishmentItem?
    var selectedCity: LocationItem?
<<<<<<< HEAD
<<<<<<< HEAD
//    var selectedEthanol: String?
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
    var selectedTags: String?
    @IBOutlet var collectionView: UICollectionView!

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        guard let city = selectedCity?.city,
<<<<<<< HEAD
<<<<<<< HEAD
//              let tag = selectedEthanol else {
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
              let tag = selectedTags else {
                  return
              }
        let manager = EstablishmentDataManager()
        manager.fetch(location: city, selectedEthanol: tag) {  // Should tag be tags? I think not because of the above assignment
            establishmentItems in if !establishmentItems.isEmpty {
                for establishmentItem in establishmentItems {
                    if let establishmentName = establishmentItem.name {
                        print(establishmentName)
                    }
                }
            } else {
                print("No data.")
            }
        }
    }
}

// MARK: Private Extension
private extension DrinkingEstablishmentsListViewController {
    // code goes here
}

// MARK:: UIColletionViewDataSource
extension DrinkingEstablishmentsListViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        1
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        collectionView.dequeueReusableCell(withReuseIdentifier: "establishmentCell", for: indexPath)
    }
}
